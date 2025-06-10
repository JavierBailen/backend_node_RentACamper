const  pool  = require('./mysql');



const aniadirFavorito = async (user_id, furgoneta_id, ) =>{
    await pool.query(
        `INSERT INTO favorito (user_id, furgoneta_id) VALUES(?,?)`,[user_id, furgoneta_id]
    )
}

const comprobarFavoritoAniadido = async (user_id, furgoneta_id) =>{
    const [resultado] = await pool.query(
        `SELECT COUNT(*) as count FROM favorito WHERE user_id = ? AND furgoneta_id = ?`,
        [user_id, furgoneta_id]
    )

    if(resultado[0].count >0){
        return resultado[0];
    }
}


const quitarFavorito = async (user_id, furgoneta_id) =>{
    await pool.query(
        `DELETE  FROM favorito WHERE user_id = ? AND furgoneta_id = ?`,[user_id, furgoneta_id]
    )
}

const listarFavoritosUser = async (user_id) =>{
    const [resultados] = await pool.query(
        `SELECT 
            favorito.id,
            favorito.user_id,
            furgonetas.id AS furgoneta_id,
            furgonetas.modelo,
            furgonetas.fotos,
            furgonetas.precio,
            furgonetas.descripcion
         FROM favorito 
         JOIN furgonetas ON favorito.furgoneta_id = furgonetas.id
         WHERE favorito.user_id= ?`,[user_id]
    )

    return resultados.map(favorito =>({
        id: favorito.id,
        user_id: favorito.user_id,
        furgoneta: {
            id: favorito.furgoneta_id,
            modelo: favorito.modelo,
            fotos: favorito.fotos,
            descripcion: favorito.descripcion,
            precio: favorito.precio
        }
    }))
    
}




module.exports = {
    aniadirFavorito,
    quitarFavorito,
    listarFavoritosUser,
    comprobarFavoritoAniadido
}