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


const deleteOneReserva = (req, res) => {
    const { reservaId } = req.params;

    if (!reservaId) {
        return res.status(400).send({
            status: "FALLO",
            data: { error: "El ID de la reserva es obligatorio" }
        });
    }

    try {
        reservaService.deleteOneReserva(reservaId);
        res.status(204).send({ status: "OK" });
    } catch (error) {
        res.status(500).send({
            status: "FALLO",
            data: { error: error.message }
        });
    }
};





module.exports = {
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta
}