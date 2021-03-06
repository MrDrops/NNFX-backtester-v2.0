const mysql = require('mysql2/promise');
const config = require('./config_db');

//Connect to the database and enable queries on the db

async function query(sql, params) {
    try {
        const connection = await mysql.createConnection(config.db);
        const [results, ] = await connection.execute(sql, params);

        return results;
    } catch(error) {
        console.error(error);
    };
};


module.exports = {
    query
}