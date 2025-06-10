const DB = require("./db.json");
const fs = require("fs");
const db = require('./mysql');
const {resend} = require('../services/resendService');

const getAllReservas = async  (filterParams)=>{
    
    let query = 'SELECT * FROM reservas';
    const params = [];
    const condiciones = [];

    if(filterParams.estado){
        condiciones.push('LOWER(estado) LIKE ?');
        params.push(`%${filterParams.estado.toLowerCase()}%`);
    }
    if(filterParams.user_id){
        condiciones.push('user_id = ?');
        params.push(filterParams.user_id);
    }

    if(condiciones.length>0){
        query += ' WHERE ' +condiciones.join(' AND ');
    }

    const [filas] = await db.query(query, params);

    return filas;

    

}

const obtenerFechasOcupadasFurgoneta = async (furgoneta_id) =>{
    

    try{
        const [filas] = await db.query(
            `SELECT fecha_inicio, fecha_fin FROM reservas
            WHERE furgoneta_id = ?`, [furgoneta_id]
        )

        const fechasReservadas = filas.map(({fecha_inicio, fecha_fin})=> ({
            fecha_inicio: fecha_inicio.toISOString().split('T')[0],
            fecha_fin: fecha_fin.toISOString().split('T')[0]
        })) 


        return fechasReservadas;



    }catch(error){
        throw new Error("Error al obtener fechas ya ocupadas");
    }
}

const getReservaById = async (userId)=>{
    const [reservas] = await db.query("SELECT * FROM reservas WHERE user_id = ?", [userId]);

    return reservas;

    
}

const createReserva = async (reservaData) => {

    const {user_id, furgoneta_id, fecha_inicio, fecha_fin } = reservaData;
    
    //existencia de furgoneta?
    const [furgonetas] = await db.query("SELECT * FROM furgonetas WHERE id = ?", [furgoneta_id]);
    const furgoneta = furgonetas[0];
    
    if(!furgoneta){
        throw new Error("Furgoneta no encontrada");
    }

    //existencia del cliente?
    const [clientes] = await db.query("SELECT * FROM users WHERE id = ?", [user_id]);
    const cliente = clientes[0];
    if(!cliente){
        throw new Error("Cliente no valido");
    }

    //obtengo la info del propietario de la furgoneta
    const [propietarios] = await db.query("SELECT * FROM users WHERE id = ?", [furgoneta.user_id])
    const propietario = propietarios[0];
    if(!propietario){
        throw new Error("Propietario no encontrado");
    }


    //validacion fechas
    const fechaInicio = new Date(fecha_inicio);
    const fechaFin = new Date(fecha_fin);
    
    //controlo fechas solapadas
    const [reservasSolapadas] = await db.query(`
        SELECT * FROM reservas 
        WHERE furgoneta_id = ?
        AND (
            (? >= fecha_inicio AND ? < fecha_fin) OR
            (? > fecha_inicio AND ? <= fecha_fin) OR
            (? <= fecha_inicio AND ? >= fecha_fin)
        )
    `, [furgoneta_id, fecha_inicio, fecha_inicio, fecha_fin, fecha_fin, fecha_inicio, fecha_fin]);

    if(reservasSolapadas.length>0){
        throw new Error("Ya existe una reserva para esta furgoneta en esas fechas")
    }

   

    const precioDia = furgoneta.precio;

    //calculo del total por dias 
    fechaInicio.setHours(0,0,0,0);
    fechaFin.setHours(0,0,0,0);
    const diferenciaDias = Math.ceil((fechaFin - fechaInicio)/(1000*60*60*24)+1);
    const precioTotal = diferenciaDias * precioDia;

    const [resultado] = await db.query(
        `INSERT INTO reservas (user_id, furgoneta_id, fecha_inicio, fecha_fin, precio_total) VALUES(?,?,?,?,?)`,
        [user_id, furgoneta_id, fecha_inicio, fecha_fin, precioTotal]
    )

    //actualizo disponibilidad de furgoneta
    await db.query(
        `UPDATE furgonetas SET disponible = 0 WHERE id = ?`,
        [furgoneta_id]
    );

    const reservaId = resultado.insertId;

    await db.query(
        `UPDATE reservas SET estado = ? WHERE id = ?`,
        ['pendiente',reservaId]
    );


    //envio correo de confirmacion de la reserva al cliente

    try{
        await resend.emails.send({
    from: 'Administración <onboarding@resend.dev>',
    to: cliente.email,
    subject: 'Confirmación Reserva',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
            <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">¡Hola ${cliente.name}!</h2>
            </div>
            
            <div style="padding: 20px; background-color: white;">
                <p style="font-size: 16px; line-height: 1.5; color: #34495e;">
                    Tu reserva de la furgoneta <strong style="color: #2c3e50;">${furgoneta.modelo}</strong> ha sido confirmada.
                </p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #2c3e50; margin-bottom: 10px;">Detalles de la Reserva:</h3>
                    <p style="margin: 5px 0;"><strong>Fecha de inicio:</strong> ${fecha_inicio}</p>
                    <p style="margin: 5px 0;"><strong>Fecha de fin:</strong> ${fecha_fin}</p>
                    <p style="margin: 15px 0; font-size: 18px; color: #2c3e50;">
                        <strong>Importe total:</strong> ${precioTotal}€
                    </p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/api/rentACamper/confirmar/${reservaId}" 
                       style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Confirmar Reserva
                    </a>
                </div>

                <p style="font-style: italic; color: #7f8c8d; text-align: center; margin-top: 30px;">
                    ¡Gracias por confiar en nosotros!
                </p>
            </div>
        </div>
    `,
})
        console.log('Enviando correo al cliente: ', cliente.email)

    }catch(error){
        console.error("Error al enviar el correo de confirmacion", error);
    }

    

    //ahora envio email para informar al propietario del alquiler de su furgoneta

    try{
        await resend.emails.send({
            from: 'Administración <onboarding@resend.dev>',
            to: propietario.email,
            subject: 'Nueva reserva de tu furgoneta',
            html: `
                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
                    <div style="text-align: center; padding: 20px; background-color: #e8f5e8; border-radius: 5px;">
                        <h2 style="color: #2c3e50; margin-bottom: 20px;">¡Hola ${propietario.name}!</h2>
                        <h3 style="color: #27ae60; margin: 0;">¡Tienes una nueva reserva!</h3>
                    </div>
                    
                    <div style="padding: 20px; background-color: white;">
                        <p style="font-size: 16px; line-height: 1.5; color: #34495e;">
                            Tu furgoneta <strong style="color: #2c3e50;">${furgoneta.modelo}</strong> ha sido reservada por <strong>${cliente.name}</strong>.
                        </p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #2c3e50; margin-bottom: 10px;">Detalles de la Reserva:</h3>
                            <p style="margin: 5px 0;"><strong>Cliente:</strong> ${cliente.name}</p>
                            <p style="margin: 5px 0;"><strong>Email del cliente:</strong> ${cliente.email}</p>
                            <p style="margin: 5px 0;"><strong>Fecha de inicio:</strong> ${fecha_inicio}</p>
                            <p style="margin: 5px 0;"><strong>Fecha de fin:</strong> ${fecha_fin}</p>
                            <p style="margin: 5px 0;"><strong>Duración:</strong> ${diferenciaDias} días</p>
                            <p style="margin: 15px 0; font-size: 18px; color: #27ae60;">
                                <strong>Ingresos esperados:</strong> ${precioTotal}€
                            </p>
                        </div>

                        

                        <p style="font-style: italic; color: #7f8c8d; text-align: center; margin-top: 30px;">
                            ¡Gracias por usar nuestra plataforma!
                        </p>
                    </div>
                </div>
            `
        });
        console.log("Enviando correo al propietario: " , propietario.email)

    }catch(error){
        console.error("Error al enviar el correo informativo al propietario", error)
    }


    

    

    const newReserva = {
        
        user_id,
        furgoneta_id,
        fecha_inicio,
        fecha_fin,
        precioTotal
    };

    
    return newReserva;
};


const deleteOneReserva = async (reservaId)=>{

    try{

        //obtengo la info de la reserva
    const [reservas] = await db.query(
        'SELECT * FROM reservas WHERE id = ? ', [reservaId]
    );

    if(reservas.length === 0){
        throw new Error('Reserva no encontrada');
    }

    const reserva = reservas[0];

    //solo permito cancelar reservas que esten en estado pendiente
    if(reserva.estado !== 'pendiente'){
        throw new Error("No se puede cancelar una reserva con estado: "+ reserva.estado)
    }

    //ahora elimono la reserva de la bd
    const [resultado] = await db.query(
        'DELETE FROM reservas WHERE id = ?', [reservaId]
    );

    //pongo la furgo a disponible
    await db.query(
        'UPDATE furgonetas SET disponible = 1 WHERE id = ?',[reservaId]
    )

    return resultado;

    }catch(error){
        throw error;
    }
    

}

const confirmarReserva = async (reservaId)=>{
    
    const [resultado] = await db.query(
        `UPDATE reservas set estado = 'confirmada' WHERE id = ? AND estado = 'pendiente'`,[reservaId]
    )

    return resultado;
}

//funcion que verifica las fechas de las reservas para saber en que estado se encuentra la reserva y
//en funcion de eso que se cambie el estado a finalizada y la furgoneta se ponga disponible()
const verificarReservas = async ()=>{
    try{
        //me traigo las reservas que no esten con estado finalizada o cancelada, ademas de que la fecha de fin de alquiler sea menor al dia de hoy
        const [reservasExpiradas] = await db.query(`
            SELECT reservas.*, furgonetas.id AS furgoneta_id_real
            FROM reservas
            JOIN furgonetas ON reservas.furgoneta_id = furgonetas.id
            WHERE DATE(reservas.fecha_fin) <= CURDATE()
            AND reservas.estado = 'confirmada'
            AND furgonetas.disponible = 0
            `
        )
        //recorro esas reservas
        for(const reserva of reservasExpiradas){
            //pongo la furgoneta como ya disponible
            await db.query(
                `UPDATE furgonetas SET disponible = 1 WHERE id = ?`,
                [reserva.furgoneta_id]
            );

            //actualizo el estado de la reserva a finalizada
            await db.query(
                `UPDATE reservas SET estado = 'finalizada' WHERE id = ?`,
                [reserva.id]
            );
            console.log(`Actualizando reserva ${reserva.id} a 'finalizada'`);

            console.log("Furgoneta",reserva.furgoneta_id, "Esta ya disponible");
            
            
        }
    }catch(error){
        console.error("Error al verificar reservas expiradas", error);
    }
}






module.exports = {
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta,
    confirmarReserva,
    verificarReservas
}