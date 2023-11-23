module.exports.tela_admin = async function(app, req, res){

    let sessao = req.session.id_tipo_usuario = result[0].id_tipo_usuario
    if(sessao == 1){

    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con)
    const model_cardapio = new app.app.models.model_cardapio(con)
    let usuario = await model_admin.post_listar_usuarios()
    let prod = await model_cardapio.post_listar_produtos()
    if(!usuario){
        usuario = [{msg:"Erro ao carregar lista de usuarios"}]
    }
    if(!prod){
        prod = [{msg:"Erro ao carregar lista de produtos"}]
    }
    res.render("admin/tela_admin.ejs",{usuario: usuario, prod:prod})    
        
    }else{
        res.redirect("/home")
    }
}
module.exports.editar_admin = function(app, req, res){
    res.render("admin/editar_user.ejs")
}

