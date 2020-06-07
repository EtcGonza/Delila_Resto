// const mysql = require('mysql2');
const colors = require('colors');
const { Sequelize } = require('sequelize');

const sequelizeDB = new Sequelize('delila_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelizeDB.authenticate().then(() => {
    console.log(colors.green('[Success] Database connected.'));
}).catch((error) => {
    console.log(colors.red('[ERROR] Problem connecting database.', error));
});

const Usuario = sequelizeDB.define('Usuario', {
    nombre: {
        type: String,
        allowNull: false
    },
    apellido: {
        type: String,
        allowNull: false
    },
    email: {
        type: String,
        allowNull: false
    },
    celular: {
        type: String,
        allowNull: false
    },
    direccion: {
        type: String,
        allowNull: false
    },
    contrasenia: {
        type: String,
        allowNull: false
    },
    administrador: {
        type: Boolean,
        allowNull: false
    },
    activo: {
        type: Boolean,
        allowNull: false
    },
});

module.exports = { sequelizeDB, Usuario };