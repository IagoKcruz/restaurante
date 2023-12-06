module.exports.tela_admin = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 1){
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con)
    const model_cardapio = new app.app.models.model_cardapio(con)
    let usuario = await model_admin.post_listar_usuarios()
    let prod = await model_cardapio.post_listar_produtos()
    let fornecedor = await model_admin.listar_fornecedores()
    if(!usuario){
        usuario = [{msg:"Erro ao carregar lista de usuarios"}]
    }
    if(!prod){
        prod = [{msg:"Erro ao carregar lista de produtos"}]
    }
    if(!fornecedor){
        fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}]
    }
    res.render("admin/tela_admin.ejs",{usuario: usuario, prod:prod, fornecedor: fornecedor})    
}else{
    res.redirect("/")
}  
    
}

module.exports.tela_editar_usuario = async function(app, req, res){
    let tipo_user = req.session.id_tipo
    if(tipo_user == 1){
        let id = req.body.id_usuario
        console.log(id)
        const con = app.config.con_server;
        const model_admin = new app.app.models.model_admin(con)
        const usuario = await model_admin.post_listar_usuario(id)
        console.log(usuario)
    res.render("admin/usuario/editar_user.ejs", {erro : {}, usuario : usuario[0]})
}else{
        res.redirect("/")
}   
}

module.exports.tela_editar_fornecedor = async function(app, req, res){
    let tipo_user = req.session.id_tipo
    if(tipo_user == 1){
        let id = req.body.id_usuario
        console.log(id)
        const con = app.config.con_server;
        const model_admin = new app.app.models.model_admin(con)
        const usuario = await model_admin.listar_fornecedor(id)
        console.log(usuario)
    res.render("admin/usuario/editar_user.ejs", {erro : {}, usuario : usuario[0]})
}else{
        res.redirect("/")
}   
}

module.exports.cadastrar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(!tipo_user == "1"){
    const dados = req.body
    console.log(dados)
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con)
    const model_admin = new app.app.models.model_admin(con)
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
        usuario = [{msg:"Email já está sendo ultilizado"}]
        res.render("user/cadastrar_user.ejs", {erro:email, usuario:dados});
        return;
    }else{
        let cadastrar = await model_admin.cadastrar_user(dados);
        if(cadastrar){
            res.redirect("/adiministrador");
        return;
        }  
    }
}else{
    res.redirect("/")
}
}

module.exports.alterar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con);
    const model_admin = new app.app.models.model_admin(con);
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    const desvio = req.validationErrors();
        if(desvio){
            res.render("user/alterar.ejs", {erro:desvio, usuario:dados});
            return;
        }else{
            let email = await model_user.post_user_by_email(dados.email);
            if(email.length != 0){
                email = [{msg:"Email já está sendo ultilizado"}]
                usuario = [{msg:"Email já está sendo ultilizado"}]
                res.render("user/editar_user.ejs", {erro:email, usuario:dados});
                return;
            }else{
                let alterar = await model_admin.update_user(dados);
                if(alterar){
                res.redirect("/administrador");
                return;
                }else{
                    alterar = [{msg:"Erro ao alterar dados"}]
                }
            }  
        }
}else{
    res.redirect("/")
}
}

module.exports.cadastrar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(!tipo_user == "1"){
    const dados = req.body
    console.log(dados)
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con)
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("cnpj", "Voce deve preencher o senha").notEmpty();
    //req.assert("senha", "O campo senha deve conter maid de 8 digitos").len(8, 32);
    const desvio = req.validationErrors();
    if(desvio){
        res.render("admin/cadastrar_forn.ejs", {erro:desvio, fornecedor:dados});
        return;
    }    
    let email = await model_admin.email(dados.email);
    if(email.length != 0){
        email = [{msg:"Email já está sendo ultilizado"}]
        res.render("user/cadastrar_user.ejs", {erro:email, usuario:email});
        return;
    }else{
        let cadastrar = await model_admin.cadastrar_fornecedor(dados);
        if(cadastrar){
            res.redirect("/adiministrador");
        return;
        }  
    }
}else{
    res.redirect("/")
}
}

module.exports.alterar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("cnpj", "Voce deve preencher o senha").notEmpty();
    const desvio = req.validationErrors();
        if(desvio){
            res.render("user/alterar.ejs", {erro:desvio, usuario:dados});
            return;
        }else{
            let email = await model_admin._email(dados.email);
            if(email.length != 0){
                email = [{msg:"Email já está sendo ultilizado"}]
                res.render("user/editar_user.ejs", {erro:email, usuario:email});
                return;
            }else{
                let alterar = await model_admin.update_fornecedor(dados);
                if(alterar){
                res.redirect("/administrador");
                return;
            }else{
                    alterar = [{msg:"Erro ao alterar dados"}]
            }
        }  
    }
}else{
    res.redirect("/")
}
}