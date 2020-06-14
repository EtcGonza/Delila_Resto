const express = require('express');
const server = express();

// - Mis middlewares.
const generalMiddleware = require('../middlewares/generales_middlewares');
const userMiddleware = require('../middlewares/usuarios_middlewares');

// - Mi producto controller.
const productoController = require('../controllers/producto_controller');


// * RECURSO PUBLICO | Obtengo los productos ACTIVOS.
server.get('/productos', [userMiddleware.validarToken], productoController.getProductos);

// * RECURSO PRIVADO | Creo un nuevo producto.
server.post('/productos', [generalMiddleware.checkBody, userMiddleware.validarToken, userMiddleware.validarPermiso], productoController.crearProducto);

// * RECURSO PRIVADO | Elimino un producto.
server.delete('/productos/:id', [generalMiddleware.checkIdParam, userMiddleware.validarToken, userMiddleware.validarPermiso], productoController.eliminarProducto);

// * RECURSO PRIVADO | Actualizo un producto.
server.put('/productos/:id', [generalMiddleware.checkIdParam, generalMiddleware.checkBody, userMiddleware.validarToken, userMiddleware.validarPermiso], productoController.actualizarProducto);

module.exports = server;