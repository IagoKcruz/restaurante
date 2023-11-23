
module.exports.pag_cadastrar_user = function(app, req, res){
    res.render("user/cadastrar.ejs", {erro : {}, usuario : {}})
}
module.exports.cadastrar_user = async function(app, req, res){
    const dados = req.body
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("senha", "Voce deve preencher o senha").notEmpty();
    //req.assert("senha", "O campo senha deve conter maid de 8 digitos").len(8, 32);
    const desvio = req.validationErrors();
    if(desvio){
        res.render("user/cadastrar.ejs", {erro:desvio, usuario:dados});
        return;
    }    
    let email = await model_user.post_user_by_email(dados.email);
    if(email.length != 0){
        email = [{msg:"Email já está sendo ultilizado"}]
        res.render("user/cadastrar.ejs", {erro:email, usuario:dados});
        return;
    }
    let cadastrar = await model_user.post_cadastrar_user(dados);
    if(cadastrar){
        res.redirect("/");
        return;
    }
}

module.exports.page_user = function(app, req, res){
    res.render("user/page_user.ejs", {erro : {}, usuario : {}})
}

module.exports.page_alterar = async function(app, req, res){
    let id = req.session.id_usuario 
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)
    const d_usuario = await model_user.post_usuario(id)
    res.render("user/alterar.ejs", {erro : {}, usuario : d_usuario[0]})

}

module.exports.alterar = async function(app, req, res){
    const dados = req.body;
    let id = req.session.id_usuario;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)

    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    //req.assert("senha", "O campo senha deve conter maid de 8 digitos").len(8, 32);
    const desvio = req.validationErrors();
    if(desvio){
        res.render("user/alterar.ejs", {erro:desvio, usuario:dados});
        return;
    }
    let email = await model_user.post_user_by_email(dados.email);
    if(email.length != 0){
        email = [{msg:"Email já está sendo ultilizado"}]
        res.render("user/alterar.ejs", {erro:email, usuario:dados});
        return;
    }
    let alterar = await model_user.post_update_user(dados, id);
    if(alterar){
        res.redirect("/page_usuario");
        return;
    }

}
