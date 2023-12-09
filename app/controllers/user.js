
module.exports.pag_cadastrar_user = function(app, req, res){
let tipo_user = req.session.id_tipo
if(!tipo_user){
    res.render("user/cadastrar.ejs", {erro : {}, usuario : {}})
}else{
    res.redirect("/")
}   
}
module.exports.cadastrar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(!tipo_user){
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
}else{
    res.redirect("/")
}
}

module.exports.page_user = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user){
    let id = req.session.id_usuario 
    const con = app.config.con_server;
    const model_user = new app.app.models.model_admin(con)
<<<<<<< HEAD
    const d_usuario = await model_user.post_listar_usuario(id)
    if(!d_usuario){
        //verificar se deu certo
=======
    let d_usuario = await model_user.post_listar_usuario(id)
    if(!d_usuario){
>>>>>>> a532e9bdd90c1a23ee9326dd6a96d0f20abfbd5c
        d_usuario = [{msg:"Erro ao carregar lista de usuários"}]
        res.render("user/page_user.ejs", {erro : d_usuario, usuario :{}});
    }else{
        res.render("user/page_user.ejs", {erro : {}, usuario : d_usuario[0]})    
    }

}else{
    res.redirect("/")
}
    
}

module.exports.page_alterar = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user){
    let id = req.session.id_usuario 
    const con = app.config.con_server;
    const model_user = new app.app.models.model_admin(con)
    const d_usuario = await model_user.post_listar_usuario(id)
    if(!d_usuario){
        //verificar se deu certo
        d_usuario = [{msg:"Erro ao carregar lista de usuários"}]
        res.render("user/editar_user.ejs", {erro : d_usuario, usuario : {}});
    }
    res.render("user/alterar.ejs", {erro : {}, usuario : d_usuario[0]})
}else{
    res.redirect("/")
}
}

module.exports.alterar = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user){
    const dados = req.body;
    let id = req.session.id_usuario;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    const desvio = req.validationErrors();
    if(desvio){
        res.render("user/alterar.ejs", {erro:desvio, usuario:dados});
        return;
    }else{
        let email = await model_user.post_user_by_email(dados.email);
        if(email.length != 0){
            if(email[0].email == dados.email){
                let alterar = await model_user.post_update_user(dados, id);
                if(alterar){
                res.redirect("/page_usuario");
                return;
                }else{
                    alterar = [{msg:"Erro ao alterar dados"}]
                    res.render("user/alterar.ejs", {erro:alterar, usuario:dados});
                }
            }else{
                    email = [{msg:"Email já está sendo ultilizado"}]
                res.render("user/alterar.ejs", {erro:email, usuario:dados});
                return;
            }
        }else{
            let alterar = await model_user.post_update_user(dados, id);
            if(alterar){
            res.redirect("/page_usuario");
            return;
            }else{
                alterar = [{msg:"Erro ao alterar dados"}]
                res.render("user/alterar.ejs", {erro:alterar, usuario:dados});
            }
        }  
    }
}else{
    res.redirect("/")
}
}

module.exports.encerrar_sessao = async function(app,req,res){
let tipo_user = req.session.id_tipo
if(tipo_user){
    req.session.destroy()
    res.redirect("/")
}else{
    res.redirect("/")
}  
}