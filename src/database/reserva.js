const DB = require("./db.json");
const fs = require("fs");
const db = require('./mysql');
const { Script } = require("vm");

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
    
    const diferenciaDias = Math.ceil((fechaFin - fechaInicio)/(1000*60*60*24));
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
        ['realizada',reservaId]
    );

    

    

    const newReserva = {
        
        user_id,
        furgoneta_id,
        fecha_inicio,
        fecha_fin,
        precioTotal
    };

    
    return newReserva;
};


const deleteOneReserva = (reservaId)=>{
    const indexDelete = DB.reservas.findIndex((reserva)=>reserva.id == reservaId);
    if(indexDelete===-1){
        return;
    }
    DB.reservas.splice(indexDelete, 1);
    fs.writeFileSync("./src/database/db.json", JSON.stringify(DB, null, 2));

}






module.exports = {
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta
}