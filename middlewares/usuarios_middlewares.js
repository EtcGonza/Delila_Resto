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

    console.log('Existe? ', existeEmail);

    if (existeEmail) {
        console.log(colors.red('[MIDDLEWARE] El email ingresado ya esta en uso.'));
        res.send({
            message: 'El email ingresado ya esta en uso.',
            status: 200
        });
    } else {
        console.log(colors.green('[MIDDLEWARE] El email disponible.'));
        next();
    }
};


// Chequeo si el objeto esta vacio.
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

async function checkEmail(userEmail) {
    await dataBase.query('SELECT email FROM usuarios', (error, emailsDB) => {

        if (error) {
            console.log(colors.red('[MIDDLEWARE][ERROR] Wrong query'));
            res.send({
                message: 'No se pudo comprobar la existencia del email ingresado.',
                status: 400
            });
        }

        const existe = emailsDB.find(emailDB => emailDB.email == userEmail);
        console.log(existe);
        return existe;
    });
}

module.exports = {
    checkBody,
    emailsDuplicados
};