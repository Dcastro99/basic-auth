const { Sequelize } = require('sequelize');
const { user } = require('./models/user');

// Get the database connection
let connection_string;
switch (process.env.NODE_ENV) {
    case 'production':
        connection_string = process.env.DATABASE_URL;
        break;
    case 'test':
        connection_string = 'sqlite::memory:';
        break;
    case 'staging':
    default:
        connection_string = `sqlite:${process.env.SQLITE_FILE ?? '../db'}`;
        break;
}

const db = new Sequelize(connection_string, {
    // For postgres only
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

module.exports = {
    db,
    // Define our models
    User: user(db),
};
