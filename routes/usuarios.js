const express = require('express');
const server = express();
const dataBase = require('../config/dataBase');

const jwt = require('jsonwebtoken');
const firmaJwt = 'I am batman';

// - MIS MIDDLEWARES
const userMiddleware = require('../middlewares/usuarios_middlewares');
const generalMiddleware = require('../middlewares/generales_middlewares');

// - ENDPOINTS DE USUARIOS
//  ? Tendria que validar que en los endpoints con body, no falten argumentos?
//  ? y si faltan, ¿deberia notificar cuales faltaron?


// * RECURSO PRIVADO | Obtengo todos los usuarios ACTIVOS.
server.get('/usuarios', userMiddleware.validarToken, userMiddleware.validarPermiso, async(req, res) => {

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

// * RECURSO PUBLICO | Creo un usuario.
server.post('/usuarios', [generalMiddleware.checkBody, userMiddleware.validarBodyType, userMiddleware.emailsDuplicados], async(req, res) => {
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

// * RECURSO PUBLICO | Elimino un usuario.
server.delete('/usuarios/:id', generalMiddleware.checkIdParam, async(req, res) => {
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
});

//  * RECURSO PUBLICO | Actualizo campo de usuarios.
server.put('/usuarios/:id', [generalMiddleware.checkIdParam, generalMiddleware.checkBody, userMiddleware.validarBodyType], async(req, res) => {
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

// * RECURSO PUBLICO | Login de usuario.
server.post('/usuarios/login', [generalMiddleware.checkBody], async(req, res) => {

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
});

// - ENPODINTS DE ADMINISTRADOR 
// * RECURSO PARA DESARROLLO | Obtengo todos los administradores ACTIVOS.
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

// * RECURSO PARA DESARROLLO | Creo un Administrador.
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

    const administradorCreado = await dataBase.UsuarioModel.create(nuevoUsuario);

    res.send({
        message: 'Administrador creado exitosamente.',
        administradorCreado
    });
});

module.exports = server;