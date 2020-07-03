const express = require('express');
const server = express();
const dataBase = require('../config/dataBase');

// - Mis middlewares.
const userMiddleware = require('../middlewares/usuarios_middlewares');
const generalMiddleware = require('../middlewares/generales_middlewares');

// - Mi usuario controller.
const usuarioController = require('../controllers/usuario_controller');

// - ENDPOINTS DE USUARIOS
//  ? Tendria que validar que en los endpoints con body, no falten argumentos?
//  ? y si faltan, ¿deberia notificar cuales faltaron?


// * RECURSO PRIVADO | Obtengo todos los usuarios ACTIVOS.
server.get('/usuarios', [userMiddleware.validarToken, userMiddleware.validarPermiso], usuarioController.getUsuarios);

// * RECURSO PUBLICO | Creo un usuario.
server.post('/usuarios', [generalMiddleware.checkBody, userMiddleware.validarBodyType, userMiddleware.emailsDuplicados], usuarioController.crearUsuario);

// * RECURSO PRIVADO | Elimino un usuario.
server.delete('/usuarios/:id', [generalMiddleware.checkIdParam, userMiddleware.validarToken], usuarioController.borrarUsuario);

//  * RECURSO PRIVADO | Actualizo campo de usuarios.
server.put('/usuarios', [generalMiddleware.checkIdParam, generalMiddleware.checkBody, userMiddleware.validarBodyType, userMiddleware.validarToken], usuarioController.actualizarUsuario);

// * RECURSO PUBLICO | Login de usuario.
server.post('/usuarios/login', [generalMiddleware.checkBody, userMiddleware.buscarUsuario], usuarioController.loginUsuario);

// - ////////////////////////// - //
// - ENPODINTS DE ADMINISTRADOR - //
// - ////////////////////////// - //
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