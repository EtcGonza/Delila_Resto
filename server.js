const express = require('express');
const server = express();
const serverPort = 3000;

const colors = require('colors');

const bodyParser = require('body-parser');
server.use(bodyParser.json());

// const jwt = require('jsonwebtoken');
// const firma = 'I am batman';

// Importo mis rutas.
server.use(require('./routes/usuarios'));
server.use(require('./routes/productos'));

// Funciones.
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