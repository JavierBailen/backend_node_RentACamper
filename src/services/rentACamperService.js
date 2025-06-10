const {v4:uuid} = require("uuid");
const Furgoneta = require("../database/furgoneta");
/** 
const getAllFurgonetas = async (filterParams)=>{
    return await Furgoneta.getAllFurgonetas(filterParams);
    
}
    */

const getAllFurgonetas = async (filterParams)=>{
    return await Furgoneta.getAllFurgonetas(filterParams)
}

getFurgonetasUser = async (user_id)=>{
    return await Furgoneta.getFurgonetasUser(user_id);
}

const getOneFurgoneta = async (furgonetaId)=>{
    return await Furgoneta.getOneFurgoneta(furgonetaId);
}

const  createNewFurgoneta = async (newFurgoneta)=>{
    const furgonetaToInsert = {
        ...newFurgoneta,//creo una copia del objeto
        id:uuid(),
        createdAt: new Date().toLocaleString("en-US", {timeZone:"UTC"}),
        updatedAt: new Date().toLocaleString("en-US", {timeZone:"UTC"})
    }
    return await Furgoneta.createNewFurgoneta(furgonetaToInsert)
}


const updateFurgoneta = async (furgonetaId, changes)=>{
    return await Furgoneta.updateOneFurgoneta(furgonetaId, changes)
}


const deleteFurgoneta = async (furgonetaId)=>{
   await  Furgoneta.deleteOneFurgoneta(furgonetaId);
    
}

const getAllUsers = async()=>{
    return await Furgoneta.getAllUsers();
}

const deleteUser = async(userId)=>{
    return await Furgoneta.deleteUser(userId)
}

const updateUser = async(userId, cambios)=>{
    return await Furgoneta.updateUser(userId, cambios)
}






module.exports = {
    updateUser,
    deleteUser,
    getAllUsers,
    getAllFurgonetas,
    getOneFurgoneta,
    createNewFurgoneta,
    updateFurgoneta,
    getFurgonetasUser,
    deleteFurgoneta,
    
}