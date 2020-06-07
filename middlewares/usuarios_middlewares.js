const colors = require('colors');
const dataBase = require('../config/dataBase');

const checkBody = (req, res, next) => {
    if (isEmpty(req.body)) {
        res.send({
            message: 'El body esta vacio!',
            status: 409
        });
    } else {
        next();
    }
};

const emailsDuplicados = async(req, res, next) => {
    const existeEmail = await checkEmail(req.body.email);

    if (existeEmail) {
        console.log(colors.red('[MIDDLEWARE] El email ingresado ya esta en uso.'));
        res.send({
            message: 'El email ingresado ya esta en uso.',
            status: 200
        });
    } else {
        console.log(colors.green('[MIDDLEWARE] El email esta disponible.'));
        next();
    }
};

// Chequeo si el objeto esta vacio.
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

// Cheque si existe algun usuario que tenga el email recibido en el body.
async function checkEmail(userEmail) {
    const emailDB = await dataBase.Usuario.findOne({ where: { email: userEmail } });
    // const emailsDB = await dataBase.query('SELECT email FROM usuarios', { type: dataBase.QueryTypes.SELECT });
    // const existe = emailsDB.find(emailDB => emailDB.email == userEmail);
    return emailDB;
}

module.exports = {
    checkBody,
    emailsDuplicados
};