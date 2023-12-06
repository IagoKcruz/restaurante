function produto (con){
    this._con = con;
}
produto.prototype.post_listar_produtos = function(callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.descr, A.preco, B.nome FROM produto A, fornecedor B WHERE A.id_fornecedor=B.id;`, function(erros,result){
            resolve(result)
        })
    })
}
produto.prototype.post_listar_produto = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.descr, A.preco, B.descr FROM produto A, fornecedor B WHERE A.id=B.id AND A.id =${id}`, function(erros,result){
            resolve(result)
        })
    })
}
produto.prototype.post_cadastrar_user = function(dados, callback){
    this._con.query(`INSERT INTO produto ?`, dados, callback)
}
produto.prototype.post_update_user = function(dados, callback){
    this._con.query(`UPDATE produto SET descr = '${dados.descr}', preco = ${dados.preco}, id_fornecedor = ${dados.id_fornecedor} WHERE id = ${dados.id}`, callback)
}
produto.prototype.post_delete_user = function(id, callback){
    this._con.query(`DELETE FROM produto WHERE id = ${id}`, callback)
}
module.exports = function(){
    return produto;
}
