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
        this._con.query(`SELECT A.id, A.descr, A.preco, B.nome FROM produto A, fornecedor B WHERE A.id=B.id AND A.id =${id}`, function(erros,result){
            resolve(result)
        })
    })
}
produto.prototype.cadastrar_prod = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`INSERT INTO produto ?`, dados, function(erros,result){
            resolve(result)
        })
    })
}
produto.prototype.alterar_produto = function(dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE produto SET descr = '${dados.descr}', preco = ${dados.preco}, id_fornecedor = ${dados.fornecedor} WHERE id = ${dados.id}`, function(erros,result){
            resolve(result)
        })
    })
}

module.exports = function(){
    return produto;
}
