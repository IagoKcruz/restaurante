const con_serve = function(){
    const mysql = require("mysql")
    return mysql.createConnection({
        host    :"localhost",
        user    :"root",
        password:"",
        database:"restaurante"
    })
}
module.exports = con_serve;