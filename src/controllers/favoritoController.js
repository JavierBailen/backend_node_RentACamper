const favoritoService = require('../services/favoritoService');

const aniadirFavorito = async (req, res) =>{
    try{
        const {user_id, furgoneta_id} = req.body;
        await favoritoService.aniadirFavorito(user_id, furgoneta_id);
        res.status(201).json({message: "Añadido a favoritos"})
    }catch(error){
        res.status(403).json({error:error.message})
    }
}

const quitarFavorito = async (req, res) =>{
    try{
        const {user_id, furgoneta_id} = req.body;
        await favoritoService.quitarFavorito(user_id, furgoneta_id);
        res.status(201).json({message:"Quitado de favoritos"});
    }catch(error){
        res.status(403).json({error:error.message})
    }
}

const listarFavoritosUser = async (req, res)=>{
    try{
        const {user_id} = req.params;
        const allFavoritosUser = await favoritoService.listarFavoritosUser(user_id);
        
        res.send({status: "Ok", data: allFavoritosUser});
    }catch(error){
        res.status(403).json({error:error.message})
    }
}


module.exports = {
    aniadirFavorito,
    quitarFavorito,
    listarFavoritosUser
}