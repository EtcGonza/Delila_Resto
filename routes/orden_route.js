const express = require('express');
const server = express();

// - Mis middlewares.
const generalMiddleware = require('../middlewares/generales_middlewares');
const userMiddleware = require('../middlewares/usuarios_middlewares');

// - Mi producto controller.
const ordenController = require('../controllers/orden_controller');

server.post('/orden', [generalMiddleware.checkBody,
    userMiddleware.validarToken
], ordenController.crearOrden);

server.get('/orden', [userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.getOrdenes);

server.delete('/orden/:id', [generalMiddleware.checkIdParam,
    userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.eliminarOrden);

server.put('/orden/:id', [generalMiddleware.checkIdParam,
    userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.actualizarOrden);

server.put('/orden/actualizarEstado/:id', [generalMiddleware.checkIdParam,
    userMiddleware.validarToken,
    userMiddleware.validarPermiso
], ordenController.actualizarSigEstadoOrden);

module.exports = server;