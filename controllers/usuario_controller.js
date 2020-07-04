const dataBase = require('../config/dataBase');
const jwt = require('jsonwebtoken');
const firmaJwt = 'I am batman';

// - Controladores de Usuario.
const usuario_controllers = {
    getUsuarios: async(req, res) => {
        const usuarios = await dataBase.UsuarioModel.findAll().catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No existen usuarios activos o hubo no se pudieron obtener.',
                error
            });
        });

        res.send({
            status: 'OK',
            usuarios_cant: usuarios.length,
            usuarios: usuarios
        });
    },

    crearUsuario: async(req, res) => {
        const nuevoUsuario = await dataBase.UsuarioModel.create(req.body).catch(error => {
            res.send({
                message: 'No se pudo crear el usuario.',
                error
            });
        });

        res.send({
            message: 'Nuevo usuario creado.',
            nuevo_usuario: nuevoUsuario
        });
    },

    borrarUsuario: async(req, res) => {
        const usuarioLogueado = res.locals.payloadUsuario;

        const usuarioEliminado = await dataBase.UsuarioModel.destroy({ where: { id_usuario: usuarioLogueado.id_usuario, administrador: false } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'Hubo un problema en la peticion.',
                error
            });
        });

        if (usuarioEliminado != 0) {
            res.send({
                status: 'OK',
                message: 'Usuario eliminado.'
            });
        } else {
            res.send({
                status: 'OK',
                message: 'El ID ingresado no existe o correspone a un administrador.',
            });
        }
    },

    actualizarUsuario: async(req, res) => {
        const usuarioLogueado = res.locals.payloadUsuario;
        delete req.body.token;
        const nuevosDatos = req.body;

        await dataBase.UsuarioModel.update(nuevosDatos, { where: { id_usuario: usuarioLogueado.id_usuario } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'El ID ingresado no existe o hubo un problema al actualizar el usuario.',
                error
            });
        });

        res.send({
            status: 'OK',
            message: 'Usuario actualizado.',
            campos_actualizados: nuevosDatos
        });
    },

    loginUsuario: async(req, res) => {
        const usuario = res.locals.usuarioValido;

        const token = await jwt.sign({ usuario_logueado: usuario }, firmaJwt, { expiresIn: new Date().getTime() + 30000 * 1000 });

        res.send({
            message: 'Login exitoso.',
            token
        });

    }
};

// - Exporto mis controladores para usarlos en usuario_routes.js.
module.exports = usuario_controllers;