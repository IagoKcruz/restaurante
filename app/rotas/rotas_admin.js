module.exports = function(app){
    app.get('/administrador',function(req, res){
        app.app.controllers.admin.tela_admin(app, req, res)
    })
    app.post('/editar_user',function(req, res){
        app.app.controllers.admin.editar_admin(app, req, res)
    })
    app.get('/page_admin',function(req, res){
        app.app.controllers.user.page_user(app, req, res)
    })
}
