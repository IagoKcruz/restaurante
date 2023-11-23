module.exports.tela_cardapio = async function(app, req, res){
    const con = app.config.con_server;
    const model_cardapio = new app.app.models.model_cardapio(con)
    let prod = await model_cardapio.post_listar_produtos()
    if(!prod){
        prod = {msg:"Erro ao carregar lista de produtos"}
    }
    res.render("cardapio/cardapio.ejs",{prod: prod});
    
}
module.exports.editar_prod = function(app, req, res){
    res.render("cardapio/editar_prod.ejs")
}