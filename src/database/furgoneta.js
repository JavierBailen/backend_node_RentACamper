const pool = require('./mysql');
const {pasarLocalizacionACoordenadas} = require('../services/geocode');

const getAllFurgonetas = async (filterParams)=>{

    let query = `
        SELECT f.*, 
               CONCAT(f.latitud, ",", f.longitud) as coordenadas,
               (SELECT fecha_fin 
                FROM reservas r 
                WHERE r.furgoneta_id = f.id 
                AND r.estado = 'confirmada'
                AND CURDATE() BETWEEN r.fecha_inicio AND r.fecha_fin
                LIMIT 1) as fecha_fin_reserva
        FROM furgonetas f
    `;
    let params = [];

    
    if(filterParams.modelo){
        query += ' WHERE LOWER(modelo) LIKE ?';
        params.push(`%${filterParams.modelo.toLowerCase()}%`)
    }else if(filterParams.localizacion){
        query += ' WHERE LOWER(localizacion) LIKE ?';
        params.push(`%${filterParams.localizacion.toLowerCase()}%`)
    }



    const [filas] = await pool.query(query, params);
    return filas;

    
}

const createNewFurgoneta = async (newFurgoneta) => {
    
    const { modelo, precio, user_id, localizacion, descripcion, fotos, disponible} = newFurgoneta;

    //obtengo las coordenadas de la localizacion usando el servicio de opencage
    const coordenadas = await pasarLocalizacionACoordenadas(localizacion);
    const latitud = coordenadas.latitud ?? null;
    const longitud = coordenadas.longitud ?? null;

    await pool.query(
        "INSERT INTO furgonetas ( modelo, precio, user_id, localizacion, latitud, longitud, descripcion, fotos, disponible) VALUES (?,?,?, ?, ?, ?, ?, ?, ?)",
        [ modelo, precio, user_id, localizacion,latitud, longitud,  descripcion, fotos, disponible ?? true]
      );
    

   

    

    return {
        modelo,
        precio,
        user_id,
        localizacion,
        latitud,
        longitud,
        descripcion,
        fotos,
        disponible
    }
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

    //si hay cambio en la localizacio, actuializo las coordenadas
    if(changes.localizacion){
        const coordenadas = await pasarLocalizacionACoordenadas(changes.localizacion);
        changes.latitud = coordenadas.latitud;
        changes.longitud = coordenadas.longitud;
    }

    const keys = Object.keys(changes);

    const campos = keys.map(key=> `${key} = ?`).join(", ");
    const valores = keys.map(key=> changes[key]);
    valores.push(furgonetaId);

    await pool.query(`UPDATE furgonetas SET ${campos} WHERE id = ?`, valores);
    
    return getOneFurgoneta(furgonetaId);

    

}


const deleteOneFurgoneta = async (furgonetaId)=>{
    await pool.query("DELETE FROM furgonetas WHERE id = ?", [furgonetaId])
}


//traer todos los usuarios
const getAllUsers = async() => {
    try {
        const [filas] = await pool.query("SELECT * FROM users");
        
        return filas;
    } catch (error) {
        console.error("Error en getAllUsers:", error); 
        throw error;
    }
};


//
const deleteUser = async(userId)=>{
    try{
        const [filas] = await pool.query("DELETE FROM users WHERE id = ?", [userId])
        return filas;
    }catch(error){
        console.error("Error en deleteUser:", error); 
        throw error;
    }
}

const updateUser = async(userId, cambios)=>{
    try{
        //asi saco los nombres de los campos que quiero actualizar
        const keys = Object.keys(cambios);
        if(keys.length===0){
            return null;
        }
        //aqui genero dinamicamente las columnas que voy a actualizar
        const setClausula = keys.map(key=> `${key}= ?`).join(', ');

        const valores = keys.map(key =>cambios[key]);

        //meto al final el id del usuario para el where
        valores.push(userId);

        //lanzo la consulta a la bd
        await pool.query(`UPDATE users SET ${setClausula} WHERE id = ?`, valores);

        //devuelvo el usuario updateado
        const [userUpdated] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
        return userUpdated[0]

    }catch(error){
        console.error("Error en updateUser", error);
    }
}


module.exports = {
    updateUser,
    deleteUser,
    getAllUsers,
    getAllFurgonetas,
    createNewFurgoneta,
    getOneFurgoneta,
    updateOneFurgoneta ,
    deleteOneFurgoneta,
    getFurgonetasUser
}