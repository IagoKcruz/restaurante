module.exports.tela_admin = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == 1){
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const model_cardapio = new app.app.models.model_cardapio(con);
    let usuario = await model_admin.post_listar_usuarios();
    let prod = await model_cardapio.post_listar_produtos();
    let fornecedor = await model_admin.listar_fornecedores();
    if(!usuario){
        usuario = [{msg:"Erro ao carregar lista de usuarios"}];
    }
    if(!prod){
        prod = [{msg:"Erro ao carregar lista de produtos"}];
    }
    if(!fornecedor){
        fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];

    }
    res.render("admin/tela_admin.ejs",{usuario: usuario, prod:prod, fornecedor: fornecedor});
    return;
}else{
    res.redirect("/");
    return;
}  
    
}

module.exports.tela_editar_usuario = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == 1){
    let id = req.body.id_usuario;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const usuario = await model_admin.post_listar_usuario(id);
    res.render("admin/usuario/editar_user.ejs", {erro : {}, usuario : usuario[0]});
    return;
}else{
    res.redirect("/");
    return;
}   
}

module.exports.tela_editar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 1){
    let id = req.body.id_usuario;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const usuario = await model_admin.listar_fornecedor(id);
    res.render("admin/usuario/editar_forn.ejs", {erro : {}, usuario : usuario[0]});
    return;
}else{
    res.redirect("/");
    return;
}   
}

module.exports.tela_cadastrar_usuario = async function(app, req, res){
    let tipo_user = req.session.id_tipo;
    if(tipo_user == 1){
        res.render("admin/usuario/cadastrar_user.ejs",{erro: {}, usuario:{}})
    }else{
        res.redirect("/");
        return;
    }  
}

module.exports.tela_cadastrar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == 1){
    res.render("admin/fornecedor/cadastrar_forn.ejs",{erro: {}, usuario:{}})
}else{
    res.redirect("/");
    return;
}  
}

module.exports.tela_cadastrar_prod = async function(app, req, res){
    let tipo_user = req.session.id_tipo;
    if(tipo_user == 1){
        const con = app.config.con_server;
        const model_admin = new app.app.models.model_admin(con);
        let fornecedor = await model_admin.listar_fornecedores();
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/cadastro_produtrar.ejs", {erro:{},  prod: {}, fornecedor: fornecedor});
        return;
        }else{
            res.render("admin/cadastro_produtrar.ejs",{erro:{},  prod: {}, fornecedor: fornecedor});   
    return;     
    }
}else{
    res.redirect("/");
    return;
}  
}

module.exports.cadastrar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(!tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con);
    const model_admin = new app.app.models.model_admin(con);
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
        email = [{msg:"Email já está sendo ultilizado"}];
        usuario = [{msg:"Email já está sendo ultilizado"}];
        res.render("user/cadastrar_user.ejs", {erro:email, usuario:dados});
        return;
    }else{
        let cadastrar = await model_admin.cadastrar_user(dados);
        if(cadastrar){
            res.redirect("/adiministrador");
        return;
        }else{
            desvio = [{msg:"Erro ao cadastrar produto"}];
            res.render("admin/cadastrar_produto.ejs",{erro:desvio, usuario:dados});
        return;
        }  
    }
}else{
    res.redirect("/")
}
}

module.exports.alterar_usuario = async function(app, req, res){
let tipo_user = req.session.id_tipo;
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
                email = [{msg:"Email já está sendo ultilizado"}];
                usuario = [{msg:"Email já está sendo ultilizado"}];
                res.render("user/editar_user.ejs", {erro:email, usuario:dados});
                return;
            }else{
                let alterar = await model_admin.update_user(dados);
                if(alterar){
                res.redirect("/administrador");
                return;
                }else{
                    alterar = [{msg:"Erro ao alterar dados"}];
                    res.render("user/editar_user.ejs", {erro:alterar, usuario:dados});
                    return;
                }
            }  
        }
}else{
    res.redirect("/");
    return;
}
}

module.exports.cadastrar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(!tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
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
        email = [{msg:"Email já está sendo ultilizado"}];
        res.render("user/cadastrar_user.ejs", {erro:email, usuario:email});
        return;
    }else{
        let cadastrar = await model_admin.cadastrar_fornecedor(dados);
        if(cadastrar){
            res.redirect("/adiministrador");
        return;
        }else{
            desvio = [{msg:"Erro ao cadastrar produto"}];
            res.render("admin/cadastrar_produto.ejs",{erro:desvio, usuario:dados});
        return;
        } 
    }
}else{
    res.redirect("/");
}
}

module.exports.alterar_forncedor = async function(app, req, res){
let tipo_user = req.session.id_tipo;
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
                email = [{msg:"Email já está sendo ultilizado"}];
                res.render("user/editar_user.ejs", {erro:email, usuario:email});
                return;
            }else{
                let alterar = await model_admin.update_fornecedor(dados);
                if(alterar){
                res.redirect("/administrador");
                return;
            }else{
                alterar = [{msg:"Erro ao alterar dados"}];
                res.render("user/editar_forn.ejs", {erro:alterar, usuario:dados});
                return;
            }
        }  
    }
}else{
    res.redirect("/");
    return;
}
}

module.exports.cadastrar_produto = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(!tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const model_cardapio = new app.app.models.model_cardapio(con);
    req.assert("descr", "Voce deve preencher o nome").notEmpty();
    req.assert("preco", "Voce deve preencher o preço").notEmpty();
    req.assert("fornecedor", "Voce deve preencher o campo de fornecedor").notEmpty();
    const desvio = req.validationErrors();
    if(desvio){
        let fornecedor = await model_admin.listar_fornecedores();    
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/cadastrar_produto.ejs", {erro:desvio, prod:dados, fornecedor: fornecedor});
            return;
        }else{
            res.render("admin/cadastrar_produto.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
            return;       
        }
    }
    let produto = await model_cardapio.cadastrar_prod(dados) ;
    if(produto){
        res.redirect("/administrador")
        return;
    }else{
        desvio = [{msg:"Erro ao cadastrar produto"}];
        res.render("admin/cadastrar_produto.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
    }

}else{
    res.redirect("/")
}
}