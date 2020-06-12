const colors = require('colors');
const dataBase = require('../config/dataBase');


// MIDDLEWARES DE USUARIO
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

const validarLogin = async(req, res, next) => {
    const usuarioValido = await validateCredenciales(req.body.email, req.body.contrasenia);

    if (usuarioValido) {
        console.log(colors.bgGreen('[MIDDLEWARE] Login exitoso.'));
        res.locals.usuarioValido = usuarioValido;
        next();
    } else {
        console.log(colors.bgRed('[MIDDLEWARE] Email o contraseña invalido o no existe.'));
        res.send({
            message: 'Email o contraseña invalido o no existe.'
        });
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

// FUNCIONES AUXILIARES
// Cheque si existe algun usuario que tenga el email recibido en el body.
async function checkEmailDisponible(userEmail) {
    const usuario = await dataBase.sequelizeDB.query("SELECT * FROM usuarios WHERE email = ?", { plain: true, replacements: [userEmail], type: dataBase.sequelizeDB.QueryTypes.SELECT });
    return usuario;
}

// Valida las credenciales para un login
async function validateCredenciales(bodyEmail, bodyPass) {
    const usuarioDB = await dataBase.sequelizeDB.query("SELECT * FROM usuarios WHERE email = ? LIMIT 1", { plain: true, replacements: [bodyEmail], type: dataBase.sequelizeDB.QueryTypes.SELECT });

    if ((usuarioDB.contrasenia == bodyPass && usuarioDB.email == bodyEmail)) {
        return usuarioDB;
    } else {
        return false;
    }

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

module.exports = {
    emailsDuplicados,
    validarLogin,
    validarBodyType
};