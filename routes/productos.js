const express = require('express');
const server = express();
const dataBase = require('../config/dataBase');

// - MIS MIDDLEWARES
const generalMiddleware = require('../middlewares/generales_middlewares');
const userMiddleware = require('../middlewares/usuarios_middlewares');

// * RECURSO PUBLICO | Obtengo los productos ACTIVOS.
server.get('/productos', [userMiddleware.validarToken], async(req, res) => {
    const productosActivos = await dataBase.productoModel.findAll({ where: { activo: true } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'No existen productos activos o no se pudieron obtener.',
            error
        });
    });

    res.send({
        status: 'OK',
        productos_cant: productosActivos.length,
        productos_activos: productosActivos
    });
});

// * RECURSO PRIVADO | Creo un nuevo producto.
server.post('/productos', [generalMiddleware.checkBody, userMiddleware.validarToken, userMiddleware.validarPermiso], async(req, res) => {
    const nuevoProducto = await dataBase.productoModel.create(req.body).catch(error => {
        res.send({
            message: 'No se pudo crear el producto.',
            error
        });
    });

    res.send({
        message: 'Nuevo producto creado.',
        nuevo_producto: nuevoProducto
    });
});

// * RECURSO PRIVADO | Elimino un producto.
server.delete('/productos/:id', [generalMiddleware.checkIdParam, userMiddleware.validarToken, userMiddleware.validarPermiso], async(req, res) => {
    const productoEliminado = await dataBase.productoModel.destroy({ where: { id_producto: req.params.id } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'Hubo un problema en la peticion.',
            error
        });
    });

    if (productoEliminado != 0) {
        res.send({
            status: 'OK',
            message: 'Producto eliminado.'
        });
    } else {
        res.send({
            status: 'OK',
            message: 'El ID ingresado no existe.',
        });
    }
});

// * RECURSO PRIVADO | Actualizo un producto.
server.put('/productos/:id', [generalMiddleware.checkIdParam, generalMiddleware.checkBody, userMiddleware.validarToken, userMiddleware.validarPermiso], async(req, res) => {
    await dataBase.productoModel.update(req.body, { where: { id_producto: req.params.id } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'El ID ingresado no existe o hubo un problema al actualizar el producto.',
            error
        });
    });

    res.send({
        status: 'OK',
        message: 'Producto actualizado.',
        campos_actualizados: req.body
    });
});

module.exports = server;