module.exports = function(app){
    app.get('/administrador',function(req, res){
        app.app.controllers.admin.tela_admin(app, req, res)
    })
    app.get('/page_admin',function(req, res){
        app.app.controllers.user.page_user(app, req, res)
    })

    app.post('/cadatrar_usuario',function(req, res){
        app.app.controllers.admin.tela_cadastrar_usuario(app, req, res)
    })
    app.post('/editar_user',function(req, res){
        app.app.controllers.admin.tela_editar_usuario(app, req, res)
    })
    app.post('/cad_usuario',function(req, res){
        app.app.controllers.admin.cadastrar_user(app, req, res)
    })
    app.post('/alterar_usuario',function(req, res){
        app.app.controllers.admin.alterar_usuario(app, req, res)
    })

    app.psot('/cadatrar_forncedor',function(req, res){
        app.app.controllers.admin.tela_cadastrar_fornecedor(app, req, res)
    })
    app.post('/editar_fornecedor',function(req, res){
        app.app.controllers.admin.tela_editar_fornecedor(app, req, res)
    })
    app.post('/cad_forncedor',function(req, res){
        app.app.controllers.admin.cadastrar_fornecedor(app, req, res)
    })
    app.post('/alterar_forncedor',function(req, res){
        app.app.controllers.admin.alterar_forncedor(app, req, res)
    })

    app.psot('/cadastrar_prod',function(req, res){
        app.app.controllers.admin.tela_cadastrar_prod(app, req, res)
    })
    app.post('/cad_prod',function(req, res){
        app.app.controllers.admin.cadastrar_prod(app, req, res)
    })
    app.post('/editar_prod',function(req, res){
        app.app.controllers.admin.tela_editar_prod(app, req, res)
    })
    app.post('/alterar_prod',function(req, res){
        app.app.controllers.admin.alterar_prod(app, req, res)
    })
}
