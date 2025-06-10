const Reserva = require("../database/reserva");
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
        const resultado = await Reserva.deleteOneReserva(reservaId);
        return resultado;
    }catch(error){
        throw error;
    }
    
}


const confirmarReserva = async (reservaId) =>{
    try{
        const resultado = await Reserva.confirmarReserva(reservaId);
        return resultado;

    }catch(error){
        throw error;
    }
}









module.exports = {
   
    getAllReservas,
    getReservaById,
    createReserva,
    deleteOneReserva,
    obtenerFechasOcupadasFurgoneta,
    confirmarReserva
}