const mysql = require('mysql');
//const { poolIncrement } = require('oracledb');
const {promisify} =require('util')

const{ database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION LOST');
        }

        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIO');
        }

        if(err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION REFUSED');
        }
    }

    if(connection) connection.release();
    console.log('DB IS CONNECTED')
    return;
});

// Promisify pool query's
pool.query = promisify(pool.query);

module.exports = pool;