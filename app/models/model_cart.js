function pedido (con){
    this._con = con;
}
pedido.prototype.pedido_aberto = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM pedido WHERE id_usuario = ${id} AND id_status = 1`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.select_tem_produto = function(pedido, produto, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM produto_pedido WHERE id_pedido = ${pedido} AND id_produto = ${produto} `, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.select_pedido_produto = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM produto_pedido WHERE id_pedido = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.select_pedido_cart = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM produto_pedido A, pedido B WHERE id_produto = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.cart_pedido = function(id, produto, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM produto_pedido A, pedido B WHERE A.id_produto = B.id AND A.id_pedido = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.select_prod_cart = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.descr, A.preco FROM produto A, produto_pedido B WHERE A.id = B.id_produto AND B.id_pedido = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.create_pedido = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`INSERT INTO pedido(id, id_usuario, id_status) VALUES(null, ${id}, 1)`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.create_produto_pedido = function(pedido, dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`INSERT INTO produto_pedido(id, id_pedido, id_produto, quantidade) VALUES(null, ${pedido}, ${dados.id_prod}, 1);`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.em_andamento = function(pedido, dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE pedido SET id_status = 2 WHERE id = ${pedido};`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.alterar_quant = function(pedido, produto, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE produto_pedido SET quantidade = quantidade + 1 WHERE id_pedido = ${pedido} AND id_produto = ${produto}`, function(erros,result){
            resolve(result)
        })
    })
}

module.exports = function(){
    return pedido;
}
