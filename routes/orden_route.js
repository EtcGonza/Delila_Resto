const express = require('express');
const server = express();

// - Mis middlewares.
const generalMiddleware = require('../middlewares/generales_middlewares');
const userMiddleware = require('../middlewares/usuarios_middlewares');
const ordenMiddlewares = require('../middlewares/ordenes_middlewares');

// - Mi producto controller.
const ordenController = require('../controllers/orden_controller');

server.post('/orden', [generalMiddleware.checkBody,
    ordenMiddlewares.validateEnumMetodoPago,
    ordenMiddlewares.checkProductsActive,
    userMiddleware.validarToken
], ordenController.crearOrden);

server.get('/orden', [userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.getOrdenes);

server.delete('/orden/:id', [generalMiddleware.checkIdParam,
    ordenMiddlewares.validateExistOrden,
    userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.eliminarOrden);

server.put('/orden/actualizarEstado/:id', [generalMiddleware.checkIdParam,
    ordenMiddlewares.validateExistOrden,
    userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.actualizarSigEstadoOrden);

module.exports = server;