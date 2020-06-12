const express = require('express');
const server = express();

const dataBase = require('../config/dataBase');

const generalMiddleware = require('../middlewares/generales_middlewares');

// Obtengo los productos ACTIVOS.
server.get('/productos', async(req, res) => {
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

// Creo un nuevo producto.
server.post('/productos/crearProducto', generalMiddleware.checkBody, async(req, res) => {
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

// Elimino un producto.
server.delete('/productos/delete/:id', generalMiddleware.checkIdParam, async(req, res) => {
    await dataBase.productoModel.destroy({ where: { id_producto: req.params.id } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'El ID ingresado no corresponde a un producto o hubo un problema en la peticion.',
            error
        });
    });

    res.send({
        status: 'OK',
        message: 'Producto eliminado.'
    });
});

// Actualizo un producto.
server.put('/productos/actualizar/:id', [generalMiddleware.checkIdParam, generalMiddleware.checkBody], async(req, res) => {
    await dataBase.productoModel.update(req.body, { where: { id_producto: req.params.id } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'El ID ingresado no existe o hubo un problema al actualizar el producto.',
            error
        });
    });

    res.send({
        status: 'OK',
        message: 'Producto eliminado.',
        campos_actualizados: req.body
    });
});

module.exports = server;