const reservaService = require("../services/ReservaService");


const getAllReservas = async (req, res)=>{
    const {cliente_id, estado } = req.query;
    const allReservas = await  reservaService.getAllReservas({cliente_id, estado})
    res.send({status:"OK", data: allReservas});
}

const getReservaById = async (req, res)=>{
    try{
        const userId = req.params.userId;
        const reservas = await reservaService.getReservaById(userId);
        res.status(200).json({status:"OK", data: reservas});
    }catch(error){
        res.status(500).json({ status: "ERROR", message: error.message });
    }
    
    
}

const obtenerFechasOcupadasFurgoneta = async (req, res)=>{
    const {furgoneta_id} = req.params;
    try{
        const fechas = await reservaService.obtenerFechasOcupadasFurgoneta(furgoneta_id);
        res.status(200).json({data:fechas});
    }catch(error){
        res.status(500).json({status: "Error", message: error.message})
    }
}


const createReserva = async (req, res)=>{
    const {user_id, furgoneta_id, fecha_inicio, fecha_fin } = req.body;

    if(!user_id || !furgoneta_id || !fecha_inicio || !fecha_fin){
        return res.status(400).send(
            {
                status:"FALLO",
                data:{error:"Todos los campos son obligatorios"}
            }
        )
    }

    try{

        const newReserva = {
            user_id, 
            furgoneta_id, 
            fecha_inicio,
            fecha_fin,
        }

        const reservaCreada = await reservaService.createReserva(newReserva);
        res.status(200).send({status:"OK", data:reservaCreada})
    }catch(error){
        res.status(500).send({ status: "FALLO", data: { error: error.message } });
    }
}


const deleteOneReserva = async (req, res) => {
    const { reservaId } = req.params;

    if (!reservaId) {
        return res.status(400).send({
            status: "FALLO",
            data: { error: "El ID de la reserva es obligatorio" }
        });
    }

    try {
        await reservaService.deleteOneReserva(reservaId);
        res.status(200).send({ status: "OK" });
    } catch (error) {
        res.status(500).send({
            status: "FALLO",
            data: { error: error.message }
        });
    }
};


const confirmarReserva = async (req, res)=>{
    const {id} = req.params;

    try{
        const confirmada = await reservaService.confirmarReserva(id);
        if(!confirmada){
            res.status(404).json({status: "Fallo", data: {error:"Reserva no encontrada"}})
        }
        //todo ok
        res.send(`
            <html>
                <head>
                    <title>Reserva Confirmada</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: #f5f5f5;
                        }
                        .container {
                            text-align: center;
                            padding: 2rem;
                            background: white;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .success { color: #28a745; }
                        .button {
                            background-color: #28a745;
                            color: white;
                            padding: 10px 20px;
                            border: none;
                            border-radius: 4px;
                            text-decoration: none;
                            margin-top: 1rem;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="success">¡Reserva Confirmada!</h1>
                        <p>Tu reserva ha sido confirmada exitosamente, puedes cerrar esta pagina.</p>
                        
                    </div>
                </body>
            </html>
        `);

    }catch (error) {
        res.status(500).send({
            status: "FALLO",
            data: { error: error.message }
        });
    }
}


////SECCION PASARELA DE PAGOS
async function crearPagoStripe(req,res){
    const {reservaId} = req.body;

    //llamada a la bd
    const reserva = await reservaService.getReservaById(reservaId);
    if(!reserva){
        res.status(400).json({mensaje:"reserva no encontrada", })
    }

    const clientSecret = await reservaService.crearPagoStripe(reserva);

    res.json({clientSecret})
}





module.exports = {
    crearPagoStripe,
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta,
    confirmarReserva
    
}