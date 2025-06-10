const DB = require("./db.json");
const fs = require("fs");

const getAllUsers = (filterParams)=>{
    let users = DB.usuarios;
    if(filterParams.rol){
        return DB.usuarios.filter((usuario)=>usuario.rol.toLowerCase().includes(filterParams.rol.toLowerCase()))
    }

    if(filterParams.nombre){
        return DB.usuarios.filter((usuario)=>usuario.nombre.toLowerCase().includes(filterParams.nombre.toLowerCase()))
    }

    if(filterParams.email){
        return DB.usuarios.filter((usuario)=>usuario.email.toLowerCase().includes(filterParams.nombre.toLowerCase()))
    }

    return users;
}

const getOneUser = (userId)=>{
    const user = DB.usuarios.find((user)=> user.id == userId);
    if(!user){
        return null;
    }
    return user;
}




module.exports = {
    getAllUsers,
    getOneUser
}