const pool = require('./mysql');

const crearValoracion = async (user_id, furgoneta_id, comentario, puntuacion) =>{
    await pool.query(
        `INSERT INTO valoracion (user_id, furgoneta_id, comentario, puntuacion, fecha) 
         VALUES (?, ?, ?, ?, ?)`,
         [user_id, furgoneta_id, comentario, puntuacion, new Date()]
    )
}


const obtenerValoracionesFurgoneta = async (furgoneta_id) =>{
    const [filas] = await pool.query(
        `SELECT 

        valoracion.id,
        valoracion.puntuacion,
        valoracion.comentario,
        users.name AS user_name

        FROM valoracion
        
        JOIN users ON valoracion.user_id = users.id
        WHERE valoracion.furgoneta_id = ?`,
        [furgoneta_id]

    );
    return filas;
}

const usuarioHaReservadoFurgoneta = async (user_id, furgoneta_id) =>{
    const [filas] = await pool.query(
        `SELECT * FROM reservas
        WHERE user_id = ? AND furgoneta_id = ?`,
        [user_id, furgoneta_id]
    );

    return filas;
}


module.exports ={
    crearValoracion,
    obtenerValoracionesFurgoneta,
    usuarioHaReservadoFurgoneta
}