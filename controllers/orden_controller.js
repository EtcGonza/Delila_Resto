const dataBase = require('../config/dataBase');
const colors = require('colors');

// - Controladores de producto.
const orden_controller = {
    crearOrden: async(req, res) => {
        // Obtengo mi usuario logueado.
        const usuarioLogueado = res.locals.payloadUsuario;

        const nuevaOrden = {
            id_usuario: usuarioLogueado.id_usuario,
            precio_total: calcularPrecioTotal(req.body.productos),
            metodo_pago: req.body.metodo_pago,
            estado: 'Nuevo',
            fecha_creado: new Date(),
            ultima_actualizacion: new Date(),
        };

        // Creo una nueva orden en la DB.
        const ordenDb = await dataBase.ordenModel.create(nuevaOrden).catch(error => {
            res.send({
                message: 'No se pudo crear la orden.',
                error
            });
        });

        // Guardo el id de la orden que acabo de crear.
        const idOrdenCreada = ordenDb.id_orden;
        const productosOrden = setProductosArrayForDb(req.body.productos, idOrdenCreada);

        // Inserto el arreglo de productos mediante un Bulk.
        const ordenProductos = await dataBase.productosOrdenModel.bulkCreate(productosOrden).catch(async(bulkError) => {
            rollBackOrdenCreada(idOrdenCreada);
            console.log(colors.bgRed('No se pudo insertar la orden de productos, se hizo un roll back de la orden creada.'));
            res.send({
                message: '[BULK] No se pudo insertar la orden de productos.',
                bulkError
            });
        });

        res.send({
            message: 'Orden Creada',
            status: 'Ok',
            nuevaOrden,
            ordenProductos
        });
    },

    getOrdenes: async(req, res) => {
        const listaOrdenes = await dataBase.ordenModel.findAll({ include: [dataBase.productosOrdenModel] }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No se pudo recuperar un listado de ordenes.',
                error
            });
        });

        res.send({
            status: 'Ok',
            ordenes_cant: listaOrdenes.length,
            listaOrdenes
        });
    },

    eliminarOrden: async(req, res) => {
        // Elimino la orden.
        const ordenEliminado = await dataBase.ordenModel.destroy({ where: { id_orden: req.params.id } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'Hubo un problema al querer eliminar la orden.',
                error
            });
        });

        // Elimino los productos de la orden.
        const productosOrden = await dataBase.productosOrdenModel.destroy({ where: { id_orden: req.params.id } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'Hubo un problema al querer eliminar los productos de la orden.',
                error
            });
        });

        // Evaluo si realmente la orden se elimino.
        if (ordenEliminado != 0 && productosOrden != 0) {
            res.send({
                status: 'OK',
                message: 'Orden eliminada.'
            });
        } else {
            res.send({
                status: 'OK',
                message: 'No existe una orden con el ID ingresado.',
            });
        }
    },

    actualizarSigEstadoOrden: async(req, res) => {
        const ordenDb = await dataBase.ordenModel.findOne({ where: { id_orden: req.params.id } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No se pudo obtener la orden.',
                error
            });
        });

        const nuevoEstado = {
            estado: actualizarSigEstado(ordenDb.estado),
            ultima_actualizacion: new Date()
        };

        if (nuevoEstado.estado != null) {
            await dataBase.ordenModel.update(nuevoEstado, { where: { id_orden: req.params.id } })
                .catch(error => {
                    res.send({
                        status: 'ERROR',
                        message: 'No se pudo actualizar el estado.',
                        error
                    });
                });

            res.send({
                message: 'Estado de la orden actualizado.',
                nuevo_estado: nuevoEstado
            });
        } else {
            res.send({
                message: 'No puede actualizar el estado de una orden ya entregada.',
            });
        }
    }
};

// Funcion para borrar la orden creada en caso de que no se pueda hacer el bulkCreate.
// para poder mantener una consistencia en la DB.
async function rollBackOrdenCreada(idOrdenCreada) {
    await dataBase.ordenModel.destroy({ where: { id_orden: idOrdenCreada } }).catch(destroyError => {
        console.log(colors.bgRed('No se pudo hacer un roll back de la orden creada.'));
        res.send({
            message: '[Destroy] No se pudo hacer un roll back de la orden creada.',
            destroyError
        });
    });
}

// Recibe un arreglo de productos del body y lo re estructura para que pueda ser enviado a la DB.
function setProductosArrayForDb(arrayProductosBody, idOrdenCreada) {
    for (let contador = 0; contador < arrayProductosBody.length; contador++) {
        const auxProdOrden = {
            id_orden: idOrdenCreada,
            id_producto: arrayProductosBody[contador].producto.id_producto,
            producto_cantidad: arrayProductosBody[contador].cantidad,
            total_producto: arrayProductosBody[contador].producto.precio * arrayProductosBody[contador].cantidad
        };
        arrayProductosBody[contador] = auxProdOrden;
    }
    return arrayProductosBody;
}

// Recibo un estado de la orden y devuelvo al siguiente.
function actualizarSigEstado(estadoActual) {
    return {
        'Nuevo': 'Confirmado',
        'Confirmado': 'Preparando',
        'Preparando': 'Enviando',
        'Enviando': 'Entregado',
        'Entregado': null
    }[estadoActual];
}

function calcularPrecioTotal(arrayProductosBody) {
    var sumaTotal = 0;
    arrayProductosBody.forEach(objetoProducto => {
        sumaTotal = sumaTotal + objetoProducto.producto.precio;
    });
    return sumaTotal;
}

// - Exporto mis controladores para usarlos en producto_routes.js.
module.exports = orden_controller;