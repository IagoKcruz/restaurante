module.exports.login = function(app, req, res){
    res.render("home/login.ejs", {erro : {}, usuario : {}});
}
module.exports.validar_login = function(app, req, res){
    const dados = req.body;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)
    req.assert("email", "Escreva um email").notEmpty();
    req.assert("senha", "Escreva uma senha").notEmpty();
    const desvio = req.validationErrors();
    if(desvio){
        res.render("home/login.ejs", {erro:desvio, usuario:dados});
        return;
    }
    model_user.validar(dados, function(erro,result){
        if(result.length == 0){
            erro_login = [{msg: "Usuario não encontrado"}]
            res.render("home/login.ejs", {erro:erro_login,usuario:dados});
            return;
        }else{
            let sessao = req.session.id_tipo = result[0].id_tipo_usuario 
            let id = req.session.id_usuario = result[0].id;
            if(sessao==2){
                res.redirect("/cardapio");
            }else if(sessao==1){
                res.redirect("/administrador")
            } 
        }
    })
}