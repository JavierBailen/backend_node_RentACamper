const express = require("express");
const rentACamperController = require("../controllers/rentACamperController");
const userController = require("../controllers/UserController");
const reservaController = require("../controllers/ReservasController");
const router = express.Router();//el router sirve para definir el tipo de nuestras peticiones(get,post,patch...)
const {autenticar} = require('../middlewares/authMiddleware');
const valoracionController = require('../controllers/valoracionController');
const favoritoController = require("../controllers/favoritoController");

//Rutas Furgonetas
router.get("/furgonetas", autenticar,  rentACamperController.getAllFurgonetas);

router.get("/furgonetas/:furgonetaId",autenticar,  rentACamperController.getOneFurgoneta);

router.get("/furgonetas/usuario/:user_id",  rentACamperController.getFurgonetasUser);

router.post("/furgonetas/crear", autenticar,  rentACamperController.createNewFurgoneta);

router.patch("/furgonetas/editar/:furgonetaId", autenticar,  rentACamperController.updateFurgoneta);

router.delete("/furgonetas/delete/:furgonetaId", autenticar,  rentACamperController.deleteFurgoneta);


//RUTAS VALORACIONES

router.post('/valoracion/crear', autenticar, valoracionController.crearValoracion); //aqui se pone tb el middleware para asegurarnos que cuando se hace la peticion post
//se ejecuta primero el middleware autenticar, el cual verificara al usuario y asignara el usuario con la info correspondiente

// Ruta adicional para compatibilidad con Laravel
router.post('/api/rentACamper/valoracion/crear', autenticar, valoracionController.crearValoracion);








//RUTAS Users

router.get("/users", autenticar, rentACamperController.getAllUsers);

//router.get("/users/:userId", userController.getOneUser);


//RUTAS Reservas

router.get("/reservas", reservaController.getAllReservas);
router.get("/reservas/:userId", reservaController.getReservaById);
router.post("/reservas/crear",  reservaController.createReserva);
router.post("/reservas/delete/:reservaId", reservaController.deleteOneReserva);
router.get('/ocupadas/:furgoneta_id', reservaController.obtenerFechasOcupadasFurgoneta);
router.get("/confirmar/:id", reservaController.confirmarReserva);
router.post("/pagos", reservaController.crearPagoStripe);


//RUTAS DE FAVORITO
router.post("/favorito", autenticar, favoritoController.aniadirFavorito);
router.delete("/favorito/quitar", autenticar, favoritoController.quitarFavorito);
router.get('/favoritos/:user_id',autenticar,  favoritoController.listarFavoritosUser);


//la pongo al final, si no falla
router.get('/:furgoneta_id', valoracionController.obtenerValoracionesFurgoneta);

//algunas de user
router.delete('/:userId', autenticar,  rentACamperController.deleteUser);
router.patch("/:userId", autenticar,  rentACamperController.updateUser);







module.exports = router;