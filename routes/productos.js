const express = require('express');
const server = express();

const colors = require('colors');
const dataBase = require('../config/dataBase');

// Obtengo los productos ACTIVOS.
server.get('/productos', (req, res) => {
    dataBase.query("SELECT * FROM productos WHERE activo = true", (error, productosActivos) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.'));
            res.send({
                message: 'Error al obtener productos.',
                status: 401
            });
        } else {
            console.log(colors.green('[Success] Select productos.'));
            console.log(colors.blue(productosActivos));
            res.send({ productosActivos });
        }
    });
});

// Creo un nuevo producto.
server.post('/productos/crearProducto', (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {

        const nuevoProducto = {
            titulo: req.body.titulo,
            precio: req.body.precio,
        };

        dataBase.query('INSERT INTO productos SET ?', nuevoProducto, (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query.', error));
                res.send({
                    message: 'Error al crear el producto.',
                    status: 401
                });
            } else {
                console.log(colors.green('[Success] product created.'));
                res.send({
                    message: 'Producto creado.',
                    status: 201,
                    nuevoProducto
                });
            }
        });
    }
});

// Elimino un producto.
server.delete('/productos/delete/:idProducto', (req, res) => {
    const idProducto = req.params.idProducto;

    dataBase.query('UPDATE productos SET activo = false WHERE id_producto = ?', idProducto, (error, data) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.', error));
            res.send({
                message: 'Wrong query or id_producto',
                status: 404
            });
        } else {
            console.log(colors.green('[Success] Usuario eliminado.'));
            res.send({
                message: 'Producto deleted successfully.',
                status: 200
            });
        }
    });

});

// Actualizo un producto.
server.put('/productos/actualizar/:idProducto', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {
        const idProducto = req.params.idProducto;

        dataBase.query('UPDATE productos set ? WHERE id_producto = ?', [req.body, idProducto], (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query or id_product'));
                res.send({
                    message: 'Wrong query or id_product',
                    status: 400
                });
            } else {
                console.log(colors.green('[Success] Product updated successfully.'));
                res.send({
                    message: 'Product updated successfully.',
                    status: 200
                });
            }
        });
    }
});

module.exports = server;