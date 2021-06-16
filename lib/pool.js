const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'demo',
    connectionLimit:10,
    connectTimeout:10,
})
module.exports = pool
