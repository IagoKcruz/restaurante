module.exports = function(app){
    app.get('/cadastrar',function(req, res){
        app.app.controllers.user.pag_cadastrar_user(app, req, res)
    })
    app.post("/cadastrar_usuario",function(req, res){
        app.app.controllers.user.cadastrar_user(app, req, res)
    })
    app.get("/page_alterar",function(req, res){
        app.app.controllers.user.page_alterar(app, req, res)
    })
    app.post("/alterar",function(req, res){
        app.app.controllers.user.alterar(app, req, res)
    })
    app.get("/encerrar_sessao",function(req, res){
        app.app.controllers.user.encerrar_sessao(app, req, res)
    })
}