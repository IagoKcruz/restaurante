const { rejects } = require("assert");

function admin (con){
    this._con = con;
    this._crypto = require("crypto");
}
admin.prototype.post_listar_usuarios = function(){
    return new Promise((resolve, rejects)=>{
        this._con.query("SELECT A.id, A.nome, A.email, B.descr FROM usuario A, tipo_usuario B WHERE A.id_tipo_usuario=B.id ;", function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.post_listar_usuario = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.nome, A.email, B.descr FROM usuario A, tipo_usuario B WHERE A.id_tipo_usuario=B.id AND A.id = ${id};`, function(erros,result){
            resolve(result)
        })
    })
    
}

admin.prototype.cadastrar_user = function(dados, callback){    
    return new Promise((resolve, rejects)=>{
        dados.senha = this._crypto.createHash("md5").update(dados.senha).digest("hex");
        this._con.query(`INSERT INTO usuario set ?`, dados, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.update_user = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE usuario SET nome = '${dados.nome}', email = '${dados.email}', id_tipo_usuario = ${dados.id_tipo_usuario} WHERE id = ${dados.id}`, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.listar_fornecedores = function(callback){    
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM fornecedor`, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.select_fornecedor = function(id, callback){    
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM fornecedor WHERE id = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.cadastrar_fornecedor = function(dados, callback){    
    return new Promise((resolve, rejects)=>{
        console.log(dados)
        this._con.query(`INSERT INTO fornecedor set ?`, dados, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.update_fornecedor = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE usuario SET nome = '${dados.nome}', email = '${dados.email}', cnpj = ${dados.cnpj} WHERE id = ${dados.id}`, function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.select_email = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM fornecedor WHERE email = '${dados}'`, function(erros,result){
            resolve(result)
        })
    })  
}   
admin.prototype.post_delete_user = function(id, callback){
    this._con.query(`DELETE FROM usuario WHERE id = ${id}`, callback)
}
module.exports = function(){
    return admin;
}
