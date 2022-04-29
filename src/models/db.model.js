const mysql = require('mysql')

const connPool = mysql.createPool({
    connectionLimit: 100,
    host: 'eu-cdbr-west-02.cleardb.net',
    user: 'b28d0a8fac12bc',
    password: '339a079c',
    database: 'heroku_1f3c7c4089fee72'
})

module.exports = connPool

