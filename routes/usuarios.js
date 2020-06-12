const express = require('express');
const server = express();

const jwt = require('jsonwebtoken');
const firma = 'I am batman';

const dataBase = require('../config/dataBase');

const userMiddleware = require('../middlewares/usuarios_middlewares');
const generalMiddleware = require('../middlewares/generales_middlewares');

// * ENDPOINTS DE USUARIOS
// Obtengo todos los usuarios ACTIVOS.
server.get('/usuarios', async(req, res) => {

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

});

// Creo un usuario.
server.post('/usuarios/crearUsuario', [generalMiddleware.checkBody, userMiddleware.validarBodyType, userMiddleware.emailsDuplicados], async(req, res) => {
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
});

// Elimino un usuario.
server.delete('/usuarios/:id', generalMiddleware.checkIdParam, async(req, res) => {
    await dataBase.UsuarioModel.destroy({ where: { id_usuario: req.params.id, administrador: false } }).catch(error => {
        res.send({
            status: 'ERROR',
            message: 'El ID ingresado corresponde a un administrador, no existe o hubo un problema al eliminar el usuario.',
            error
        });
    });

    res.send({
        status: 'OK',
        message: 'Usuario eliminado.'
    });
});

// Actualizo campo de usuarios.
server.put('/usuarios/actualizar/:id', [generalMiddleware.checkIdParam, userMiddleware.validarBodyType, generalMiddleware.checkBody], async(req, res) => {
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
});

// Login de usuario.
server.post('/usuarios/login', [generalMiddleware.checkBody, userMiddleware.validarLogin], async(req, res) => {
    const token = jwt.sign({ usuario_logueado: res.locals.usuarioValido }, firma);

    res.send({
        message: 'Login exitoso.',
        token
    });
});

// * ENPODINTS DE ADMINISTRADOR
// Obtengo todos los administradores ACTIVOS.
server.get('/usuarios/administradores', async(req, res) => {
    const administradoresActivos = await dataBase.query("SELECT * usuarios WHERE activo = true", { type: sequelize.QueryTypes.SELECT });

    if (administradoresActivos.length > 0) {
        res.send({
            status: 'OK',
            cantidad_Administradores: administradoresActivos.length,
            administradoresActivos
        });
    } else {
        res.send({
            status: 'OK',
            message: 'No existen administradores activos.'
        });
    }
});

// Creo un Administrador.
server.post('/usuarios/crearAdministrador', [generalMiddleware.checkBody, userMiddleware.emailsDuplicados], async(req, res) => {
    const nuevoUsuario = {
        id_usuario: 0,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        celular: req.body.celular,
        direccion: req.body.direccion,
        contrasenia: req.body.contrasenia,
        administrador: true,
        activo: true
    };

    const administradorCreado = await dataBase.Usuario.create(nuevoUsuario);

    res.send({
        message: 'Administrador creado exitosamente.',
        administradorCreado
    });
});

module.exports = server;