const { pasarLocalizacionACoordenadas } = require("../services/geocode");
const rentACamperService = require("../services/rentACamperService");

/////////SECCION FURGONETAS
/** 
const getAllFurgonetas = async (req, res) =>{
    try{
        const {modelo, direccion, disponible} = req.query;
        const allFurgonetas = await rentACamperService.getAllFurgonetas({modelo, direccion, disponible});
        res.send({status: "OK", data:allFurgonetas});
    }catch(error){
        res.status(500).json({error: "Error al obtener las furgonetas"});
    }
   
    
    
}
    */

const getAllFurgonetas = async(req,res)=>{
    try{
        const filterParams = {
            localizacion: req.query.localizacion,
            modelo: req.query.modelo
        }
        const furgonetas = await rentACamperService.getAllFurgonetas(filterParams);

        res.status(200).json({status: "OK", data: furgonetas})

    }catch(error){
        res.status(500).json({ status: "ERROR", message: error.message });

    }
    

}

//traer todos los users
const getAllUsers = async(req,res) =>{
    try{
        const users = await rentACamperService.getAllUsers();

        res.status(200).json({status:"OK", data: users})

    }catch(error){
        res.status(500).json({ status: "ERROR", message: error.message });
    }
}

const getFurgonetasUser = async (req, res)=>{
    try{
        const {user_id} = req.params;
        const furgonetasUser = await rentACamperService.getFurgonetasUser(user_id)
        res.send({status: "OK", data:furgonetasUser});
    }catch(error){
        res.status(500).json({error: "Error al obtener las furgonetas"});
    }
}


const getOneFurgoneta = async (req, res)=>{

    try{
        const {furgonetaId} = req.params;
        const furgoneta = await rentACamperService.getOneFurgoneta(furgonetaId);
        if(!furgoneta){
            return res.status(404).json({error:"Furgoneta no encontrada"});

        }

        res.send({status:"OK", data:furgoneta})
    }catch(error){
        res.status(500).json({error: "Error al obtener la furgoneta"}); 
    }
    
}

const createNewFurgoneta = async (req, res)=>{
    try{

    const {modelo, precio, user_id, localizacion, descripcion, fotos} = req.body;
    //validacion campos obligatorios
    if(!modelo || !precio || !user_id || !localizacion || !descripcion || !fotos){
        return res.status(400).send({
            status: "FALLO",
            data: {
                error:"Te falta el modelo, precio, user_id, localizacion, descripcion o fotos"
            }
        })
    }

    //validacion tipo de datos
    if(typeof modelo !=="string" || typeof descripcion !=="string"){
        return res.status(400).json({error: "El campo modelo y descripcion tiene que ser string"})
    }
    if(typeof precio !=="number" || precio<=0){
        return res.status(400).json({error: "Precio debe ser un numero mayor a 0"})
    }
    if(typeof user_id !=="number" || user_id<=0){
        return res.status(400).json({error: "user_id debe ser un numero mayor a 0"})
    }

    const coordenadas = await pasarLocalizacionACoordenadas(localizacion);
    const latitud = coordenadas.latitud ?? null;
    const longitud = coordenadas.longitud ?? null;

    const newFurgoneta = {modelo, precio, user_id, localizacion, latitud, longitud, descripcion, fotos, disponible:true}

    const createdFurgoneta = await rentACamperService.createNewFurgoneta(newFurgoneta);

    return res.status(201).json(createdFurgoneta);

    }catch(error){
        console.log(error);
        res.status(500).json({error: "Error al crear la furgoneta"})
    }
    
}

const updateFurgoneta = async (req, res)=>{
    try{
        const {furgonetaId} = req.params;
        const updatedFurgoneta = await rentACamperService.updateFurgoneta(furgonetaId, req.body);
        res.send({status:"OK", data: updatedFurgoneta})

    }catch(error){
        res.status(500).json({error:"Error al actualizar la furgoneta"})
    }
    
}

const deleteFurgoneta = async (req, res)=>{
    try{
        const {furgonetaId} = req.params;
        await rentACamperService.deleteFurgoneta(furgonetaId);
        res.status(204).send();

    }catch(error){
        res.status(500).json({error:"Error al borrar la furgoneta"}) 
    }
    
}

//////////// FIN SECCION FURGONETAS

const deleteUser = async(req,res)=>{
    try{
        const {userId} = req.params;
        await rentACamperService.deleteUser(userId);
        res.status(204).send();

    }catch(error){
        res.status(500).json({error:"Error al borrar al usuario"}) 
    }
}

const updateUser = async(req, res)=>{
    try{
        const {userId} = req.params;
        const cambios = req.body;
        const usuarioUpdated = await rentACamperService.updateUser(userId, cambios);

        if(!usuarioUpdated){
            res.status(400).json({error:"No se proporcionaron cambios"})
        }
        
        res.status(200).send(usuarioUpdated);
    }catch(error){
        res.status(500).json({error:"Error al updatear al usuario"}) 
    }
}
















module.exports = {
    updateUser,
    deleteUser,
    getAllUsers,
    getAllFurgonetas,
    getOneFurgoneta,
    createNewFurgoneta,
    updateFurgoneta,
    deleteFurgoneta,
    getFurgonetasUser
}