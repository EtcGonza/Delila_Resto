const { Sequelize } = require('sequelize');
const colors = require('colors');

const sequelizeDB = new Sequelize('delila_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
    logging: false
});

sequelizeDB.authenticate()
    .then(() => console.log(colors.green('Database connected.')))
    .catch((error) => console.log(colors.red('Error in data base', error)));


// const Usuario = sequelizeDB.define('Usuario', {
//     id_usuario: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         unique: true,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     nombre: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     apellido: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     celular: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     direccion: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     contrasenia: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     administrador: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false
//     },
//     activo: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false
//     }
// });

module.exports = { sequelizeDB };