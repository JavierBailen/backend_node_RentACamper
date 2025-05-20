const valoracionService = require('../services/valoracionService');

const crearValoracion = async (req, res)=>{
    try{
        const {user_id, furgoneta_id, comentario, puntuacion} = req.body;
        

        await valoracionService.crearNuevaValoracion(user_id, furgoneta_id, comentario, puntuacion)
        res.status(201).json({message:"Valoracion creada!"})
    }catch(error){
        res.status(403).json({error:error.message})
    }
}

const obtenerValoracionesFurgoneta = async (req, res)=>{
    try{
        const {furgoneta_id} = req.params;
        const valoraciones = await valoracionService.obtenerValoracionesFurgoneta(furgoneta_id);
        res.status(201).json({status: "OK", data: valoraciones})
    }catch(error){
        res.status(403).json({error:"Error al obtener las valoraciones"})

    }



}


module.exports = {
    obtenerValoracionesFurgoneta, 
    crearValoracion
}