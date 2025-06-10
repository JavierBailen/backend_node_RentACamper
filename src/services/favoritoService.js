const Favorito = require("../database/favorito");

const aniadirFavorito = async (user_id, furgoneta_id) =>{
    try{
        //primero compruebo si el favorito ya existe
        const favoritoExistente = await Favorito.comprobarFavoritoAniadido(user_id, furgoneta_id);
        if(favoritoExistente){
            throw new Error("Esta furgoneta ya esta añadida a favoritos");
        }    
        await Favorito.aniadirFavorito(user_id, furgoneta_id);
    }catch(error){
        throw error;
    }
}

const quitarFavorito = async(user_id, furgoneta_id) =>{
    await Favorito.quitarFavorito(user_id, furgoneta_id);
}

const listarFavoritosUser = async(user_id)=>{
    return await Favorito.listarFavoritosUser(user_id);
    
}


module.exports = {
    aniadirFavorito,
    quitarFavorito,
    listarFavoritosUser
}