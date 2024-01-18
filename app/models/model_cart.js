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
pedido.prototype.produto_pedido = function(id, callback){
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
pedido.prototype.cart_pedido = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.id_pedido, A.id_produto, A.quantidade, C.descr FROM produto_pedido A, pedido B, status_pedido C WHERE A.id_produto = B.id AND A.id_pedido = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.unico_produto_cart = function(id, prod, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT A.id, A.descr, A.preco FROM produto A, produto_pedido B WHERE A.id = B.id_produto AND B.id_pedido = ${id} AND id_produto = ${prod}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.create_pedido = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`INSERT INTO pedido(id_usuario, id_status) VALUES(${id}, 1)`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.detalhe_pedido = function(pedido, dados, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`INSERT INTO produto_pedido(id, id_pedido, id_produto, quantidade) VALUES(null, ${pedido}, ${dados.id_prod}, 1);`, function(erros,result){
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
pedido.prototype.quant_cart = function(pedido, produto, quant, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE produto_pedido SET quantidade = ${quant} WHERE id = ${pedido} AND id_produto = ${produto}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.delete_cart = function(detalhe_pedido, pedido, produto, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`DELETE FROM produto_pedido WHERE id = ${detalhe_pedido} AND id_pedido = ${pedido} AND id_produto = ${produto}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.em_andamento = function(pedido, usuario, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE pedido SET id_status = 2 WHERE id = ${pedido} AND id_usuario = ${usuario}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.pedido_em_andamento = function(id, pedido, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM pedido WHERE id_usuario = ${id} AND id_status = 2 AND id = ${pedido} `, function(erros,result){
            resolve(result)
        })
    })
}
//admin aceita
pedido.prototype.pedido_aceito = function(id, pedido, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE pedido SET id_status = 3 WHERE id = ${pedido}`, function(erros,result){
            resolve(result)
        })
    })
}
//admin cancela
pedido.prototype.pedido_cancelado = function(id, pedido, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`UPDATE pedido SET id_status = 4 WHERE id = ${pedido}`, function(erros,result){
            resolve(result)
        })
    })
}
//admin
pedido.prototype.pedidos = function(callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM pedido`, function(erros,result){
            resolve(result)
        })
    })
}
//enviar id
pedido.prototype.pedidos_usuario = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM pedido WHERE id_usuario = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
//enviar id e status
pedido.prototype.pedidos_especificos = function(id, status, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM pedido WHERE id_usuario = ${id} AND status = ${status}`, function(erros,result){
            resolve(result)
        })
    })
}
pedido.prototype.status = function(id, callback){
    return new Promise((resolve, rejects)=>{
        this._con.query(`SELECT * FROM status_pedido WHERE id = ${id}`, function(erros,result){
            resolve(result)
        })
    })
}
module.exports = function(){
    return pedido;
}
