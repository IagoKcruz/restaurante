module.exports = function(app){
    app.get('/administrador',function(req, res){
        app.app.controllers.admin.tela_admin(app, req, res)
    })
    app.post('/editar_user',function(req, res){
        app.app.controllers.admin.editar_admin(app, req, res)
    })
}
