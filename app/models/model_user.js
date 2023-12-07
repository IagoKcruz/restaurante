function user (con){
    this._con = con;
    this._crypto = require("crypto");
}
user.prototype.post_cadastrar_user = function(dados, callback){    
    return new Promise((resolve, rejects)=>{
        dados.senha = this._crypto.createHash("md5").update(dados.senha).digest("hex");
        this._con.query(`INSERT INTO usuario set ?`, dados, function(erros,result){
            resolve(result)
        })
    })
}

user.prototype.validar = function(dados, callback){
    const senha = this._crypto.createHash("md5").update(dados.senha).digest("hex");
    this._con.query(`SELECT * FROM usuario WHERE email = '${dados.email}' AND senha = '${senha}'`, callback);
}

user.prototype.post_update_user = function(dados, id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE usuario SET nome = '${dados.nome}', email = '${dados.email}' WHERE id = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}

user.prototype.post_user_by_email = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM usuario WHERE email = '${dados.email}'`, function(erros,result){
            resolve(result)
        })
    })  
}   
module.exports = function(){
    return user;
}