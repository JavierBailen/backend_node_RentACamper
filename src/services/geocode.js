const axios = require('axios');

const apiKey = "4fd880063e0445bfbd0a20f201c3417a";

async function pasarLocalizacionACoordenadas(localizacion) {
    if(!localizacion){
        return;
    }

    try{
        const response = await axios.get("https://api.opencagedata.com/geocode/v1/json",{
            params: {
                 q : localizacion,
                key : apiKey,
                limit: 1
            }
        })
        const resultados = response.data.results;

        if(resultados.length >0){
            const {lat, lng} = resultados[0].geometry;
            return {latitud:lat, longitud:lng}
        }else{
            console.log("No se encontraron resultados")
        }

    }catch(error){
        console.error("Error en la geocodificacion", error.message)
        return null;
    }
    
}


module.exports = {
    pasarLocalizacionACoordenadas
}