const dataBase = require('../config/dataBase');

// - Controladores de producto.
const producto_controllers = {

    getProductos: async(req, res) => {
        const productos = await dataBase.productoModel.findAll().catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No existen productos activos o no se pudieron obtener.',
                error
            });
        });

        res.send({
            status: 'OK',
            productos_cant: productos.length,
            productos
        });
    },

    crearProducto: async(req, res) => {
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
    },

    eliminarProducto: async(req, res) => {
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
    },

    actualizarProducto: async(req, res) => {
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
    }
};

// - Exporto mis controladores para usarlos en producto_routes.js.
module.exports = producto_controllers;