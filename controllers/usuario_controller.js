const dataBase = require('../config/dataBase');
const jwt = require('jsonwebtoken');
const firmaJwt = 'I am batman';

// - Controladores de Usuario.
const usuario_controllers = {
    getUsuarios: async(req, res) => {
        const usuariosActivos = await dataBase.UsuarioModel.findAll({ where: { activo: true } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'No existen usuarios activos o hubo no se pudieron obtener.',
                error
            });
        });

        res.send({
            status: 'OK',
            usuarios_cant: usuariosActivos.length,
            usuarios_activos: usuariosActivos
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
        const usuarioEliminado = await dataBase.UsuarioModel.destroy({ where: { id_usuario: req.params.id, administrador: false } }).catch(error => {
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
        await dataBase.UsuarioModel.update(req.body, { where: { id_usuario: req.params.id } }).catch(error => {
            res.send({
                status: 'ERROR',
                message: 'El ID ingresado no existe o hubo un problema al actualizar el usuario.',
                error
            });
        });

        res.send({
            status: 'OK',
            message: 'Usuario eliminado.',
            campos_actualizados: req.body
        });
    },

    loginUsuario: async(req, res) => {

        const { email, contrasenia } = req.body;

        const usuarioValido = await dataBase.UsuarioModel.findOne({ where: { email: email, contrasenia: contrasenia } });

        if (usuarioValido) {
            const token = jwt.sign({ usuario_logueado: usuarioValido }, firmaJwt, { expiresIn: new Date().getTime() + 30000 * 1000 });

            res.send({
                message: 'Login exitoso.',
                token
            });
        } else {
            res.send({
                message: 'Email/contraseña no valido.',
            });
        }
    }
};

// - Exporto mis controladores para usarlos en usuario_routes.js.
module.exports = usuario_controllers;