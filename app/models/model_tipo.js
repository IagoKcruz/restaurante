function tipo (con){
    this._con = con;
}
tipo.prototype.post_listar_tipo = function(callback){
    this._con.query(`SELECT * FROM tipo_usuario`, callback)
}
module.exports = function(){
    return tipo;
}
