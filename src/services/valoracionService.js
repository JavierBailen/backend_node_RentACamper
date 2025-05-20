const Valoracion = require('../database/valoracion');

const crearNuevaValoracion = async (user_id, furgoneta_id, comentario, valoracion)=>{
    const usuarioPuedeValorar = await Valoracion.usuarioHaReservadoFurgoneta(user_id, furgoneta_id);

    if(!usuarioPuedeValorar){
        throw new Error('Solo puedes valorar las furgonetas que has alquilado');

    }
    await Valoracion.crearValoracion(user_id, furgoneta_id, comentario, valoracion)
}


const obtenerValoracionesFurgoneta= async (furgoneta_id)=>{
    return await Valoracion.obtenerValoracionesFurgoneta(furgoneta_id);
}

module.exports = {
    crearNuevaValoracion,
    obtenerValoracionesFurgoneta
}