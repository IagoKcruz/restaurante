module.exports.tela_cardapio = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 2){
    const con = app.config.con_server;
    const model_cardapio = new app.app.models.model_cardapio(con)
    let prod = await model_cardapio.post_listar_produtos()
    if(!prod){
        prod = {msg:"Erro ao carregar lista de produtos"}
    }
    res.render("cardapio/cardapio.ejs",{prod: prod});
}else{
    res.redirect("/")
}  
}
module.exports.editar_prod = function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 1){
    res.render("cardapio/editar_prod.ejs")
}else{
    res.redirect("/")
}
}