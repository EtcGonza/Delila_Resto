const { Sequelize } = require('sequelize');
const colors = require('colors');

const sequelizeDB = new Sequelize('delila_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
    logging: false,
    typeValidation: true
});

sequelizeDB.authenticate()
    .then(() => console.log(colors.green('Database connected.')))
    .catch((error) => console.log(colors.red('Error in data base', error)));


const UsuarioModel = sequelizeDB.define('Usuario', {
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellido: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    celular: {
        type: Sequelize.STRING,
        allowNull: false
    },
    direccion: {
        type: Sequelize.STRING,
        allowNull: false
    },
    contrasenia: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    administrador: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

const productoModel = sequelizeDB.define('Producto', {
    id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    precio: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
});

const ordenModel = sequelizeDB.define('Ordenes', {
    id_orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    precio_total: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    metodo_pago: {
        type: Sequelize.ENUM,
        values: ['Efectivo', 'Tarjeta'],
        allowNull: false
    },
    estado: {
        type: Sequelize.ENUM,
        values: ['Nuevo', 'Confirmado', 'Preparando', 'Enviando', 'Entregado'],
        allowNull: false
    },
    fecha_creado: {
        type: Sequelize.DATE,
        allowNull: false
    },
    ultima_actualizacion: {
        type: Sequelize.DATE,
        allowNull: false
    }
});

const productosOrdenModel = sequelizeDB.define('ProductosOrdenes', {
    id_prodOrdenes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        primaryKey: true,
        autoIncrement: true
    },
    id_orden: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
        // references: 'ordenes',
    },
    id_producto: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    producto_cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    total_producto: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

ordenModel.hasMany(productosOrdenModel, { foreignKey: 'id_orden' });
productosOrdenModel.belongsTo(ordenModel, { foreignKey: 'id_orden' });

module.exports = {
    sequelizeDB,
    UsuarioModel,
    productoModel,
    ordenModel,
    productosOrdenModel
};