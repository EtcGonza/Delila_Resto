const express = require('express');
const server = express();
const serverPort = 3000;

const colors = require('colors');

const bodyParser = require('body-parser');
server.use(bodyParser.json());

// Importo mis rutas.
server.use(require('./routes/usuario_routes'));
server.use(require('./routes/productos_routes'));
server.use(require('./routes/orden_route'));


const conditional = (key, valueKey) => {
    return {
        where: {
            [key]: valueKey
        }
    };
};

console.log(conditional('id_usuario', '3'));

server.listen(serverPort, () => {
    console.log(colors.green('----------------'));
    console.log(colors.green('[Listering] port', serverPort));
});