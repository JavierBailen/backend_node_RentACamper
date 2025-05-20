const Reserva = require("../database/reserva");
const {v4:uuid} = require("uuid");

const getAllReservas = async (filterParams)=>{
    try{
        const allReservas =  await Reserva.getAllReservas(filterParams);
        //filtros

        return allReservas;
    }catch(error){
        throw error;
    }
}

const getReservaById = async (userId)=>{
    try{
        const reservas = await Reserva.getReservaById(userId);
        return reservas;  
    }catch(error){
        throw error;
    }
    
}

const createReserva = async (datosReserva)=>{
    try{
        const reservaInsert = {
            ...datosReserva,
            
        }
        const reservaCreada = await Reserva.createReserva(reservaInsert);
        return reservaCreada;
    }catch(error){
        throw error;
    }
}

const obtenerFechasOcupadasFurgoneta = async (furgoneta_id) =>{
    try{
        const fechas = await Reserva.obtenerFechasOcupadasFurgoneta(furgoneta_id);
        return fechas;
    }catch(error){
        throw error;
    }
}

const deleteOneReserva = async (reservaId)=>{
    try{
        await Reserva.deleteOneReserva(reservaId);
    }catch(error){
        throw error;
    }
    Reserva.deleteOneReserva(reservaId);
}





module.exports = {
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta
}