const userService = require("../services/UserService");

const getAllUsers = (req, res)=>{
    const {nombre, email, rol} = req.query;
    const allUsers = userService.getAllUsers({nombre, email, rol});
    res.send({status:"OK", data: allUsers})
}


    const getOneUser = (req, res)=>{
        const {
            params: {userId},
        } = req;
    
        if(!userId){
            return;
        }
        const user = userService.getOneUser(userId);
        res.send({status: "OK", data:user});
    }





module.exports = {
    getAllUsers,
    getOneUser
}