const express = require('express');
const server = express();

const colors = require('colors');
const dataBase = require('../config/dataBase');

const middlewares = require('../middlewares/usuarios_middlewares');

// Obtengo los productos ACTIVOS.
server.get('/productos', async(req, res) => {

    const productosActivos = await dataBase.sequelizeDB.query("SELECT * FROM productos WHERE activo = true", { type: dataBase.sequelizeDB.QueryTypes.SELECT });

    if (productosActivos.length > 0) {
        res.send({
            status: 'OK',
            cantidad_Usuarios: productosActivos.length,
            productosActivos
        });
    } else {
        res.send({
            status: 'OK',
            message: 'No existen productos activos.'
        });
    }

});

// Creo un nuevo producto.
server.post('/productos/crearProducto', middlewares.checkBody, (req, res) => {

    dataBase.sequelizeDB.query("INSERT INTO productos (titulo, precio) VALUES (?, ?)", {
        replacements: [req.body.titulo, req.body.precio],
        type: dataBase.sequelizeDB.QueryTypes.INSERT
    }).then(() => {
        res.send({
            message: 'Producto creado exitosamente.',
            status: 201
        });
    }).catch((error) => {
        res.send({
            message: 'No se pudo crear el producto.',
            error
        });
    });
});

// Elimino un producto.
server.delete('/productos/delete/:idProducto', (req, res) => {

    dataBase.sequelizeDB.query("DELETE FROM productos WHERE id_producto = ?", { replacements: [req.params.idProducto] })
        .then((resultados) => {
            if (resultados[0].affectedRows == 1) {
                res.send({
                    status: 200,
                    message: 'Producto eliminado satisfactoriamente.',
                });
            } else {
                res.send({
                    status: 200,
                    message: 'No existe un producto con ese ID.',
                });
            }
        })

    .catch((error) => {
        res.send({
            status: 400,
            message: 'Error de SQL',
            error
        });
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