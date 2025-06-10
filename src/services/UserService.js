const {v4:uuid} = require("uuid");
const User = require("../database/user");


const getAllUsers = (filterParams)=>{
    try{
        const allUsers = User.getAllUsers(filterParams);
        return allUsers;
    }catch(error){
        throw error;
    }
    
}

const getOneUser = (furgonetaId)=>{
    try{
        const user = User.getOneUser(furgonetaId);
        return user;
    }catch(error){
        throw error;
    }
}


module.exports = {
    getAllUsers,
    getOneUser
}

