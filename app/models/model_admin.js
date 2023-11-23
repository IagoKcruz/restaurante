const { rejects } = require("assert");

function admin (con){
    this._con = con;
    this._crypto = require("crypto");
}
admin.prototype.post_listar_usuarios = function(){
    return new Promise((resolve, rejects)=>{
        this._con.query("SELECT A.nome, A.email, B.descr FROM usuario A, tipo_usuario B WHERE A.id_tipo_usuario=B.id ;", function(erros,result){
            resolve(result)
        })
    })
}
admin.prototype.post_listar_usuario = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.nome, A.email, B.descr FROM usuario A, tipo_usuario B WHERE A.id=B.id AND A.id = ${id};`, function(erros,result){
            resolve(result)
        })
    })
    
}
admin.prototype.post_cadastrar_user = function(dados, callback){
    this._con.query(`INSERT INTO usuario ?`, dados, callback)
}
admin.prototype.post_update_user = function(dados, callback){
    this._con.query(`UPDATE usuario SET nome = '${dados.nome}', email = '${dados.email}', id_tipo_usuario = ${dados.id_tipo_usuario} WHERE id = ${dados.id}`, callback)
}
admin.prototype.post_delete_user = function(id, callback){
    this._con.query(`DELETE FROM usuario WHERE id = ${id}`, callback)
}
module.exports = function(){
    return admin;
}
