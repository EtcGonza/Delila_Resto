const mysql = require('mysql');
const colors = require('colors');

let dataBase;

function connectDatabase() {

    if (!dataBase) {
        dataBase = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'delila_resto'
        });
    }

    dataBase.connect((error) => {
        if (!error) {
            console.log(colors.green('[Success] Database connected.'));
        } else {
            console.log(colors.red('[ERROR] Problem connecting database.'));
        }
    });

    return dataBase;
}

module.exports = connectDatabase();