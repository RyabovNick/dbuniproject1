const mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 1000,
    host: 'unidb.ru',
    port: 3306,
    user: 'reader',
    password: '123456',
    database: 'students'
})

module.exports = pool
