module.exports = function(app){
    app.post('/add_cart',function(req, res){
        app.app.controllers.pedido.open_pedido(app, req, res)
    })
    app.get('/carrinho',function(req, res){
        app.app.controllers.pedido.open_cart(app, req, res)
    })
    app.post('/editar_quant',function(req, res){
        app.app.controllers.pedido.editar_cart(app, req, res)
    })
}
