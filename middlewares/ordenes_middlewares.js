const colors = require('colors');
const dataBase = require('../config/dataBase');

const ordenesMiddlewares = {
    checkProductsActive: (req, res, next) => {
        const productosBody = req.body.productos;
        const invalidos = productosBody.filter(objetoProducto => objetoProducto.producto.activo === false);

        if (invalidos.length > 0) {
            console.log(colors.bgRed('En la orden existen productos que no estan disponibles. La orden sera cancelada.'));
            res.send({
                status: 'Error',
                message: 'En la orden existen productos que no estan disponibles. La orden sera cancelada.'
            });
        } else {
            next();
        }
    },

    validateEnumMetodoPago: (req, res, next) => {
        const metodoPago = req.body.metodo_pago;

        if (metodoPago === 'Efectivo' || metodoPago === 'Tarjeta') {
            next();
        } else {
            console.log(colors.bgRed('Metodo de pago no valido. La orden sera cancelada.'));
            res.send({
                status: 'Error',
                message: 'Metodo de pago no valido. La orden sera cancelada.'
            });
        }
    },

    validateExistOrden: async(req, res, next) => {
        const existe = await dataBase.ordenModel.findOne({ where: { id_orden: req.params.id } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No se pudo recuperar un listado de ordenes.',
                error
            });
        });

        if (!existe) {
            res.send({
                status: 'ERROR',
                message: 'El id ingresado no corresponde a una orden existente.'
            });
        } else {
            next();
        }
    }
};

module.exports = ordenesMiddlewares;