const express = require('express');
const server = express();

const colors = require('colors');
const dataBase = require('../config/dataBase');

// Obtengo todos los usuarios ACTIVOS.
server.get('/usuarios', (req, res) => {
    dataBase.query("SELECT * FROM usuarios WHERE activo = true AND administrador = false", (error, usuariosActivos) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.'));
            res.json('Error al obtener usuarios.');
            res.status(401);
        } else {
            console.log(colors.green('[Success] Select usuarios.'));
            console.log(colors.blue(usuariosActivos));
            res.json(usuariosActivos);
        }
    });
});

// Obtengo todos los administradores ACTIVOS.
server.get('/usuarios/administradores', (req, res) => {
    dataBase.query("SELECT * FROM usuarios WHERE activo = true AND administrador = true", (error, administradoresActivos) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.'));
            res.json('Error al obtener administradores.');
            res.status(401);
        } else {
            console.log(colors.green('[Success] Select administradores.'));
            console.log(colors.blue(administradoresActivos));
            res.json(administradoresActivos);
        }
    });
});

// Creo un usuario.
server.post('/usuarios/crearUsuario', (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {

        const nuevoUsuario = {
            id_usuario: null,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            celular: req.body.celular,
            direccion: req.body.direccion,
            contrasenia: req.body.contrasenia,
            administrador: false,
            activo: true
        };

        dataBase.query('INSERT INTO usuarios SET ?', nuevoUsuario, (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query.', error));
                res.json('Error al crear el usuario.');
                res.status(401);
            } else {
                console.log(colors.green('[Success] User created.'));
                res.status(201);
                res.json(nuevoUsuario);
            }
        });
    }
});

// Creo un Administrador.
server.post('/usuarios/crearAdministrador', (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {

        const nuevoUsuario = {
            id_usuario: null,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            celular: req.body.celular,
            direccion: req.body.direccion,
            contrasenia: req.body.contrasenia,
            administrador: true,
            activo: true
        };

        dataBase.query('INSERT INTO usuarios SET ?', nuevoUsuario, (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query.', error));
                res.json('Error al crear el administrador.');
                res.status(401);
            } else {
                console.log(colors.green('[Success] Admin created.'));
                res.status(201);
                res.json(nuevoUsuario);
            }
        });
    }
});

// Elimino un usuario.
server.delete('/usuarios/delete/:idUsuario', (req, res) => {
    const idUsuario = req.params.idUsuario;

    dataBase.query('UPDATE usuarios SET activo = false WHERE id_usuario = ?', idUsuario, (error, data) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.', error));
            res.status(404).send({
                message: 'Wrong query or id_usuario'
            });
        } else {
            console.log(colors.green('[Success] Usuario eliminado.'));
            res.status(200).send({
                message: 'Usuario deleted successfully.'
            });
        }
    });
});

// Actualizo campo de usuarios.
server.put('/usuarios/actualizar/:idUsuario', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {
        const idUsuario = req.params.idUsuario;

        dataBase.query('UPDATE usuarios set ? WHERE id_usuario = ?', [req.body, idUsuario], (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query or id_usuario'));
                res.status(400).send({
                    message: 'Wrong query or id_usuario'
                });
            } else {
                console.log(colors.green('[Success] User updated successfully.'));
                res.send({
                    message: 'User updated successfully.'
                });
            }
        });

    }
});

server.post('/usuarios/login', (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    }

    const credenciales = {
        email: req.body.email,
        contrasenia: req.body.contrasenia
    };

    const usuarioEncontrado = validarUsuariocontrasenia(credenciales.email, credenciales.contrasenia);

    if (usuarioEncontrado) {
        const token = jwt.sign({ usuarioEncontrado }, firma);
        console.log(colors.green('Login exitoso!'));
        res.status(200);
        res.json(token);
    } else {
        console.log(colors.red('Fallo el login'));
        res.status(200);
        res.json('Usuario o contraseña incorrectos');
    }
});

module.exports = server;