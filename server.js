const express = require('express');
const server = express();
const serverPort = 3000;

const colors = require('colors');

const bodyParser = require('body-parser');
server.use(bodyParser.json());

// Importo mis rutas.
server.use(require('./routes/usuarios'));
server.use(require('./routes/productos'));

server.listen(serverPort, () => {
    console.log(colors.green('----------------'));
    console.log(colors.green('[Listering] port', serverPort));
});