const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustedConnection: true,
        trustServerCertificate: true,
    },
};


async function connect() {
    try {
        const pool = await sql.connect(config);
        console.log("Connect to database succesfull");
        return pool;
    } catch (err) {
        console.error("Connecting to database error is:", err);
    }
}


module.exports = {
    sql,
    connect
};