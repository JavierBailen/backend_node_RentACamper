const axios = require('axios');

const autenticar = async (req, res, next) =>{
    //me traigo el token del cliente
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({message: "Token requerido"})
    }

    try{
        //aqui hago la peticion con el token obtenido en la cabecera del cliente
        const response = await axios.get('http://localhost:8000/api/auth/user', {
            headers: {
                Authorization: token, 
                Accept: 'application/json'
            }
        })

        //si la peticion anterior es ok asigno los datos del usuario autenticado (los guardo en req.user para que esten disponible para los contorladores)
        req.user = response.data;

        //para que el flujo continue
        next();
    }catch(error){
        return res.status(401).json({message: "Token invalido o expirado"})
    }
}


module.exports = {
    autenticar
}

/**
 * verifico el token usando l endpoint de laravel /api/auth/user.

    si el token es ok, deja pasar

    si no responde con 401
 */