const colors = require('colors');

const dataBase = require('../config/dataBase');


// MIDDLEWARES DE USUARIO
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




// Chequeo si el objeto esta vacio.
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

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



module.exports = {
    checkBody,
    emailsDuplicados,
    validarLogin
};