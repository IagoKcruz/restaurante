module.exports = function(app){
    app.get('/cardapio',function(req, res){
        app.app.controllers.cardapio.tela_cardapio(app, req, res)
    })
    app.post('/editar_prod',function(req, res){
        app.app.controllers.cardapio.editar_prod(app, req, res)
    })
    
}