const colors = require('colors');
const dataBase = require('../config/dataBase');
const jwt = require('jsonwebtoken');
const firmaJwt = 'I am batman';

// - MIDDLEWARES DE USUARIO
const emailsDuplicados = async(req, res, next) => {
    const existeEmail = await checkEmailDisponible(req.body.email);

    if (existeEmail) {
        console.log(colors.bgRed('[MIDDLEWARE] El email ingresado ya esta en uso.'));
        res.send({
            message: 'El email ingresado ya esta en uso.',
            status: 200
        });
    } else {
        console.log(colors.bgGreen('[MIDDLEWARE] El email esta disponible.'));
        next();
    }
};

const validarBodyType = (req, res, next) => {
    const invalidValues = validarTipos(req.body);

    if (invalidValues.length > 0) {
        console.log(colors.bgRed('[MIDDLEWARE] Valores ingresados invalidos, todos los datos deben ser strings.'));
        res.send({
            message: 'Valores ingresados invalidos, todos los datos deben ser strings.',
            invalidValues
        });
    } else {
        next();
    }
};

const validarToken = (req, res, next) => {

    if (!req.body.token) {
        console.log(colors.bgRed('[MIDDLEWARE] Para acceder a este recurso necesita un token valido.'));
        res.send({
            message: 'Para acceder a este recurso necesita un token valido.',
        });
    } else {

        jwt.verify(req.body.token, firmaJwt, (error, decoded) => {

            if (error) {
                console.log(colors.bgRed('[MIDDLEWARE] El token ingresado no es valido/confiable o expiro.'));
                res.send({
                    message: 'El token ingresado no es valido/confiable o expiro.',
                });
            } else {
                console.log(colors.bgGreen('[MIDDLEWARE] Token valido.'));
                res.locals.payloadUsuario = decoded.usuario_logueado;
                next();
            }
        });
    }
};

const validarPermiso = (req, res, next) => {
    if (esAdministrador(res.locals.payloadUsuario)) {
        console.log(colors.bgGreen('[MIDDLEWARE] Es administrador.'));
        next();
    } else {
        console.log(colors.bgRed('[MIDDLEWARE] No tiene permisos para acceder a este recurso.'));
        res.send({
            message: 'No tiene permisos para acceder a este recurso.',
        });
    }
};

// - FUNCIONES AUXILIARES
// Cheque si existe algun usuario que tenga el email recibido en el body.
async function checkEmailDisponible(userEmail) {
    const usuario = await dataBase.sequelizeDB.query("SELECT * FROM usuarios WHERE email = ?", { plain: true, replacements: [userEmail], type: dataBase.sequelizeDB.QueryTypes.SELECT });
    return usuario;
}

function validarTipos(body) {
    const bodyValues = Object.values(body);
    const invalidValues = [];

    for (let contador = 0; contador < bodyValues.length; contador++) {
        if (typeof bodyValues[contador] !== 'string') {
            invalidValues.push(bodyValues[contador]);
        }
    }

    return invalidValues;
}

function esAdministrador(usuario) {
    return (usuario.administrador === true);
}

module.exports = {
    emailsDuplicados,
    validarBodyType,
    validarToken,
    validarPermiso
};