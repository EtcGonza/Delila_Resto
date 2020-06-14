const express = require('express');
const server = express();

// - Mis middlewares.
const generalMiddleware = require('../middlewares/generales_middlewares');
const userMiddleware = require('../middlewares/usuarios_middlewares');

// - Mi producto controller.
const productoController = require('../controllers/producto_controller');

// - Seteo middleware para cada endpoint.
server.use(userMiddleware.validarToken);
server.post(generalMiddleware.checkBody, userMiddleware.validarPermiso);
server.delete(generalMiddleware.checkIdParam, userMiddleware.validarPermiso);
server.put(generalMiddleware.checkIdParam, generalMiddleware.checkBody, userMiddleware.validarPermiso);

// - Endpoints  de productos.
// * RECURSO PUBLICO | Obtengo los productos ACTIVOS.
server.get('/productos', productoController.getProductos);

// * RECURSO PRIVADO | Creo un nuevo producto.
server.post('/productos', productoController.crearProducto);

// * RECURSO PRIVADO | Elimino un producto.
server.delete('/productos/:id', productoController.eliminarProducto);

// * RECURSO PRIVADO | Actualizo un producto.
server.put('/productos/:id', productoController.actualizarProducto);

module.exports = server;