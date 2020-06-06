const express = require('express');
const server = express();
const serverPort = 3000;

const colors = require('colors');

const mysql = require('mysql');
const dataBase = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'delila_resto'
});

dataBase.connect((error) => {
    if (!error) {
        console.log(colors.green('[Success] Database connected.'));
    } else {
        console.log(colors.red('[ERROR] Problem connecting database.'));
    }
});

// const jwt = require('jsonwebtoken');
// const firma = 'I am batman';

const bodyParser = require('body-parser');
server.use(bodyParser.json());

// ENDPOINTS USUARIOS
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

// ENDPOINTS PRODUCTOS
server.get('/productos', (req, res) => {
    dataBase.query("SELECT * FROM productos WHERE activo = true", (error, productosActivos) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.'));
            res.send({
                message: 'Error al obtener productos.',
                status: 401
            });
        } else {
            console.log(colors.green('[Success] Select productos.'));
            console.log(colors.blue(productosActivos));
            res.send({ productosActivos });
        }
    });
});

server.post('/productos/crearProducto', (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {

        const nuevoProducto = {
            titulo: req.body.titulo,
            precio: req.body.precio,
        };

        dataBase.query('INSERT INTO productos SET ?', nuevoProducto, (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query.', error));
                res.send({
                    message: 'Error al crear el producto.',
                    status: 401
                });
            } else {
                console.log(colors.green('[Success] product created.'));
                res.send({
                    message: 'Producto creado.',
                    status: 201,
                    nuevoProducto
                });
            }
        });
    }
});

server.delete('/productos/delete/:idProducto', (req, res) => {
    const idProducto = req.params.idProducto;

    dataBase.query('UPDATE productos SET activo = false WHERE id_producto = ?', idProducto, (error, data) => {
        if (error) {
            console.log(colors.red('[ERROR] Wrong query.', error));
            res.send({
                message: 'Wrong query or id_producto',
                status: 404
            });
        } else {
            console.log(colors.green('[Success] Usuario eliminado.'));
            res.send({
                message: 'Producto deleted successfully.',
                status: 200
            });
        }
    });

});

server.put('/productos/actualizar/:idProducto', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    } else {
        const idProducto = req.params.idProducto;

        dataBase.query('UPDATE productos set ? WHERE id_producto = ?', [req.body, idProducto], (error) => {
            if (error) {
                console.log(colors.red('[ERROR] Wrong query or id_product'));
                res.send({
                    message: 'Wrong query or id_product',
                    status: 400
                });
            } else {
                console.log(colors.green('[Success] Product updated successfully.'));
                res.send({
                    message: 'Product updated successfully.',
                    status: 200
                });
            }
        });
    }
});

// Funciones
function validarUsuariocontrasenia(email, contrasenia) {
    const usuarioEncontrado = usuarios.find(usuario => {
        if (usuario.email === email && usuario.contrasenia === contrasenia) {
            return true;
        }
    });

    if (usuarioEncontrado) {
        console.log('Usuario validado correctamente'.green, colors.blue(usuarioEncontrado));
        return usuarioEncontrado;
    } else {
        console.log('Usuario con credenciales incorrectas'.red);
        return usuarioEncontrado;
    }
}

server.listen(serverPort, () => {
    console.log(colors.green('----------------'));
    console.log(colors.green('[Listering] port', serverPort));
});