const Favorito = require("../database/favorito");

const aniadirFavorito = async (user_id, furgoneta_id) =>{
    try{    
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