const colors = require('colors');

const checkBody = (req, res, next) => {
    if (isEmpty(req.body)) {
        console.log(colors.bgRed('[MIDDLEWARE] El body no puede estar vacio.'));
        res.send({
            message: 'El body esta vacio.',
            status: 409
        });
    } else {
        next();
    }
};

const checkIdParam = (req, res, next) => {
    if (isNaN(req.params.id)) {
        console.log(colors.bgRed('[MIDDLEWARE] El Id pasado no es un numero.'));
        res.send({
            message: 'El Id pasado no es un numero.',
            status: 409
        });
    } else {
        next();
    }
};

// FUNCIONES AUXILIARES
// Chequea si el objeto esta vacio.
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
    checkBody,
    checkIdParam
};