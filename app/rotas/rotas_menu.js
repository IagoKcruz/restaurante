module.exports = function(app){
    app.get('/',function(req, res){
        app.app.controllers.home.login(app, req, res)
    })
    app.post('/verificar',function(req, res){
        app.app.controllers.home.validar_login(app, req, res)
    })
    app.get('/page_usuario',function(req, res){
        app.app.controllers.user.page_user(app, req, res)
    })
}
