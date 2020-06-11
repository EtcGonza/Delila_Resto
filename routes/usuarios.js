const express = require('express');
const server = express();

const jwt = require('jsonwebtoken');
const firma = 'I am batman';

const dataBase = require('../config/dataBase');

const middlewares = require('../middlewares/usuarios_middlewares');

// ENDPOINTS DE USUARIOS
// Obtengo todos los usuarios ACTIVOS.
server.get('/usuarios', async(req, res) => {

    const usuariosActivos = await dataBase.sequelizeDB.query("SELECT * FROM usuarios WHERE activo = true", { type: dataBase.sequelizeDB.QueryTypes.SELECT });

    if (usuariosActivos.length > 0) {
        res.send({
            status: 'OK',
            cantidad_Usuarios: usuariosActivos.length,
            usuariosActivos
        });
    } else {
        res.send({
            status: 'OK',
            message: 'No existen usuarios activos.'
        });
    }
});

// Creo un usuario.
server.post('/usuarios/crearUsuario', [middlewares.checkBody, middlewares.emailsDuplicados], async(req, res) => {

    dataBase.sequelizeDB.query("INSERT INTO usuarios (nombre, apellido, email, celular, direccion, contrasenia, administrador, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", {
        replacements: [req.body.nombre,
            req.body.apellido,
            req.body.email,
            req.body.celular,
            req.body.direccion,
            req.body.contrasenia,
            false,
            true
        ],
        type: dataBase.sequelizeDB.QueryTypes.INSERT
    }).then(() => {
        res.send({
            message: 'Usuario creado exitosamente.',
            status: 201
        });
    }).catch((error) => {
        res.send({
            message: 'No se pudo crear el usuario.',
            error
        });
    });

});

// Elimino un usuario.
server.delete('/usuarios/delete/:idUsuario', (req, res) => {

    dataBase.sequelizeDB.query("DELETE FROM usuarios WHERE id_usuario = ?", { replacements: [req.params.idUsuario] })
        .then((resultados) => {
            if (resultados[0].affectedRows == 1) {
                res.send({
                    status: 200,
                    message: 'Usuario eliminado satisfactoriamente.',
                });
            } else {
                res.send({
                    status: 200,
                    message: 'No existe un usuario con ese ID.',
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

// Actualizo campo de usuarios.
server.put('/usuarios/actualizar/:idUsuario', (req, res) => {
    console.log('Campos a actualizar', req.body);

    dataBase.sequelizeDB.query("UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, celular = ?, direccion = ?, contrasenia = ?,  WHERE id_usuario = ?", { replacements: [req.body.nombre, req.body.apellido, req.body.email, req.body.celular, req.body.direccion, req.body.contrasenia, req.params.idUsuario], type: dataBase.sequelizeDB.QueryTypes.UPDATE })
        .then((resultados) => {
            console.log("RESULTADOS", resultados);
            res.send({
                message: 'Then',
                resultados
            })
        }).catch((error) => {
            console.log("ERRORES", error);
        });
});

// Login de usuario.
server.post('/usuarios/login', [middlewares.checkBody, middlewares.validarLogin], async(req, res) => {
    const token = jwt.sign({ usuario_logueado: res.locals.usuarioValido }, firma);

    res.send({
        message: 'Login exitoso.',
        token
    });
});

// ENPODINTS DE ADMINISTRADOR
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
server.post('/usuarios/crearAdministrador', [middlewares.checkBody, middlewares.emailsDuplicados], async(req, res) => {

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