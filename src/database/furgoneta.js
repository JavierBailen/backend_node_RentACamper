const DB = require("./db.json");
const fs = require("fs");
const pool = require('./mysql');

const getAllFurgonetas = async (filterParams)=>{
    let query = 'SELECT * FROM furgonetas';
    let params = [];

    
    if(filterParams.modelo){
        query += ' WHERE LOWER(modelo) LIKE ?';
        params.push(`%${filterParams.modelo.toLowerCase()}%`)
    }else if(filterParams.direccion){
        query += ' WHERE LOWER(direccion) LIKE ?';
        params.push(`%${filterParams.direccion.toLowerCase()}%`)
    }else if(filterParams.disponible !=undefined){
        query += ' WHERE disponible = ?';
        const valorDisponible = filterParams.disponible ==='true' ? 1:0;
        params.push(valorDisponible);

    }



    const [filas] = await pool.query(query, params);
    return filas;

    
}

const createNewFurgoneta = async (newFurgoneta) => {
    
    const { modelo, precio, user_id, localizacion, descripcion, fotos, disponible} = newFurgoneta;

    await pool.query(
        "INSERT INTO furgonetas ( modelo, precio, user_id, localizacion, descripcion, fotos, disponible) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [ modelo, precio, user_id, localizacion, descripcion, fotos, disponible ?? true]
      );
    

   

    

    return newFurgoneta;
};

const getFurgonetasUser = async (user_id) => {
    const [filas] = await pool.query(
        `SELECT * 
         FROM reservas 
         JOIN furgonetas  ON reservas.furgoneta_id = furgonetas.id
         WHERE reservas.user_id = ?`, 
        [user_id]
    );
    return filas;
}


//hago Number(furgonetaId) porque asi convierto el string que recibo en un numero para que === funcione correctamente
const getOneFurgoneta = async (furgonetaId)=>{
    const [filas] = await pool.query("SELECT * FROM furgonetas WHERE id = ?", [furgonetaId]);
    return filas[0];
    
}

const updateOneFurgoneta = async (furgonetaId, changes)=>{

    const keys = Object.keys(changes);

    const campos = keys.map(key=> `${key} = ?`).join(", ");
    const valores = keys.map(key=> changes[key]);
    valores.push(furgonetaId);

    await pool.query(`UPDATE furgonetas SET ${campos} WHERE id = ?`, [
        ...valores.slice(0, -1),
        new Date().toISOString(),
        valores[valores.length - 1],
    ]);

    return getOneFurgoneta(furgonetaId);

    

}


const deleteOneFurgoneta = async (furgonetaId)=>{
    await pool.query("DELETE FROM furgonetas WHERE id = ?", [furgonetaId])
}


module.exports = {
    getAllFurgonetas,
    createNewFurgoneta,
    getOneFurgoneta,
    updateOneFurgoneta ,
    deleteOneFurgoneta,
    getFurgonetasUser
}