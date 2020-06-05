const express = require("express");
const server = express();
const jwt = require('jsonwebtoken');

const bodyParser = require("body-parser");
const firma = 'I am batman';

const colors = require('colors');

server.use(bodyParser.json());
// server.use(existeUsuario);

const productos = [{
        id: 1,
        titulo: 'Hamburguesa',
        precio: 432,
        activo: true
    },
    {
        id: 2,
        titulo: 'Tallerines',
        precio: 180,
        activo: true
    },
    {
        id: 3,
        titulo: 'Shawarma',
        precio: 280,
        activo: true
    },
    {
        id: 4,
        titulo: 'Ramen',
        precio: 350,
        activo: true
    }
];

const usuarios = [{
        id: 1,
        nombre: "Gonzalo",
        apellido: "Etchegaray",
        email: "xetchegaray@gmail.com",
        celular: 341349691,
        direccion: "Presidente Roca 1566",
        contrasenia: "0000000000",
        administrador: false,
        activo: true
    },
    {
        id: 2,
        nombre: "Nancy",
        apellido: "Garcia",
        email: "Nancy@gmail.com",
        celular: 341349691,
        direccion: "Presidente Roca 1566",
        contrasenia: "0000000000",
        administrador: false,
        activo: true
    },
    {
        id: 3,
        nombre: "Leandro",
        apellido: "Moyano",
        email: "Leandro@gmail.com",
        celular: 341349691,
        direccion: "Tucuman 1060",
        contrasenia: "0000000000",
        administrador: false,
        activo: true
    },
    {
        id: 4,
        nombre: "Matias",
        apellido: "Moyano",
        email: "Matias@gmail.com",
        celular: 341349691,
        direccion: "San juan 750",
        contrasenia: "0000000000",
        administrador: false,
        activo: true
    },
    {
        id: 5,
        nombre: "Ramon",
        apellido: "Etchegaray",
        email: "Ramon@gmail.com",
        celular: 341349691,
        direccion: "3 de febrero 700",
        contrasenia: "0000000000",
        administrador: false,
        activo: true
    },
];

// ENDPOINTS USUARIOS
server.get('/usuarios', (req, res) => {
    const usuarioActivos = usuarios.filter(usuario => usuario.activo === true);
    res.json(usuarioActivos);
});

server.post('/usuarios/crear', existeUsuario(), (req, res) => {

    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    }

    const nuevoUsuario = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        direccion: req.body.direccion,
        celular: req.body.celular,
        email: req.body.email,
        activo: true,
        administrador: false,
        contrasenia: "0000000000"
    };

    usuarios.push(nuevoUsuario);
    res.status(200).json(nuevoUsuario);
});

server.delete('/usuarios/delete/:idUsuario', (req, res) => {
    const idUsuario = parseInt(req.params.idUsuario);
    const usuarioEncontrado = usuarios.find(usuario => usuario.id === idUsuario);

    if (usuarioEncontrado) {
        usuarioEncontrado.activo = false;
        res.status(200);
        res.json('Usuario eliminado');
    } else {
        res.status(200);
        res.json('No se pudo eliminar al Usuario');
    }

});

server.put('/usuarios/actualizar/idUsuario', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    }

    const usuarioEncontrado = usuarios.find(usuario => usuario.id === idUsuario);
    const keys = Object.keys(req.body);

    console.log(colors.green('Mis keys:', keys));

    keys.forEach(key => {
        usuarioEncontrado[key] = request.body[key];
    });

    console.log(colors.green('Usuario actualizado correctamente.'.green, usuarioEncontrado));

    res.status(200);
    res.json(usuarioEncontrado);
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
    const productoValidos = productos.filter(producto => producto.activo === true);
    res.json(productoValidos);
});

server.post('/productos/crear', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    }

    const nuevoProducto = {
        id: 1,
        titulo: req.body.titulo,
        precio: req.body.precio
    };

    productos.push(nuevoProducto);

    res.status(200);
    res.json(nuevoProducto);
});

server.delete('/productos/delete/:idProducto', (req, res) => {
    const idProducto = parseInt(req.params.idProducto);
    const productoEncontrado = productos.find(producto => producto.id === idProducto);

    if (productoEncontrado) {
        productoEncontrado.activo = false;
        res.status(200);
        res.json('Producto eliminado');
    } else {
        res.status(200);
        res.json('No se pudo eliminar al Usuario');
    }

});

server.put('/productos/actualizar/idProducto', (req, res) => {
    if (!req.body) {
        return res.status(409).send("El body esta vacio!");
    }

    const productoEncontrado = productos.find(producto => producto.id === idProducto);
    const keys = Object.keys(req.body);

    console.log('Mis Keys: '.green, keys);

    keys.forEach(key => {
        productoEncontrado[key] = request.body[key];
    });

    console.log('[PUT] Producto actualizado correctamente.'.green, productoEncontrado);

    res.status(200);
    res.json(productoEncontrado);
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

server.listen(3000, () => {
    console.log("Listering.");
});