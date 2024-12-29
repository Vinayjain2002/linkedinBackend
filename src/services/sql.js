'use strict'

const config= require('../config/index')
const mysql = require('mysql')
const bluebird= require('bluebird')

const pool= mysql.createPool({
    connectionLimit: config.sql.connectionLimit,
    host: config.sql.host,
    user: config.sql.user,
    password: config.sql.password,
    database: config.sql.database,
    port: config.sql.port,
    debug: false,
    multipleStatements: true
})

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection was closed.')
        }
        if(err.code=== 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connection')
        }
        if(err.code==='ECONNREFUSED'){
            console.error('Database connection was refused');
        }
    }
    if(connection){
        // used to return the connection to the pool after using it
        connection.release();
    }
})


// this statement need to be checked
pool.query= bluebird.promisify(pool.query)

module.exports= pool;