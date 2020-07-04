const colors = require('colors');
const dataBase = require('../config/dataBase');
const jwt = require('jsonwebtoken');
const firmaJwt = 'I am batman';

// - MIDDLEWARES DE USUARIO

const usuarioMiddlewares = {
    emailsDuplicados: async(req, res, next) => {
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
    },

    validarBodyType: (req, res, next) => {
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
    },

    validarToken: (req, res, next) => {

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
    },

    buscarUsuario: async(req, res, next) => {
        const usuario = await buscarUsuarioDB(req.body.email, req.body.contrasenia);
        if (usuario) {
            console.log(colors.bgGreen('[MIDDLEWARE] Credenciales correctas.'));
            res.locals.usuarioValido = usuario;
            next();
        } else {
            console.log(colors.bgRed('[MIDDLEWARE] Email/ contrasenia no valido.'));
            res.send({
                message: 'Email/contraseña no valido.',
            });
        }
    },

    validarPermiso: (req, res, next) => {
        if (esAdministrador(res.locals.payloadUsuario)) {
            console.log(colors.bgGreen('[MIDDLEWARE] Es administrador.'));
            next();
        } else {
            console.log(colors.bgRed('[MIDDLEWARE] No tiene permisos para acceder a este recurso.'));
            res.send({
                message: 'No tiene permisos para acceder a este recurso.',
            });
        }
    }
};

// - FUNCIONES AUXILIARES
// Cheque si existe algun usuario que tenga el email recibido en el body.
async function checkEmailDisponible(userEmail) {
    const usuario = await dataBase.sequelizeDB.query("SELECT * FROM usuarios WHERE email = ?", { plain: true, replacements: [userEmail], type: dataBase.sequelizeDB.QueryTypes.SELECT });
    return usuario;
}

// Valido todos los tipos que recibi en el body.
function validarTipos(body) {
    const bodyValues = Object.values(body);
    const invalidValues = [];

    bodyValues.find(element => {
        if (typeof element !== 'string') {
            invalidValues.push(element);
        }
    });

    return invalidValues;
}

// Devuelvo si el usuario es administrador o no.
function esAdministrador(usuario) {
    return (usuario.administrador === true);
}

async function buscarUsuarioDB(email, contrasenia) {
    const usuarioDb = await dataBase.UsuarioModel.findOne({ where: { email: email, contrasenia: contrasenia } });
    // Este usuarioDb puede contener el usuario o no contener nada
    // si no contiene un usuario es porque alguna credencial (pass, email) no es valida.
    return usuarioDb;
}

module.exports = usuarioMiddlewares;