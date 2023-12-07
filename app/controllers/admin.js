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

module.exports.tela_cadastrar_usuario = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == 1){
    res.render("admin/usuario/cadastrar_user.ejs",{erro: {}, usuario:{}})
}else{
    res.redirect("/");
    return;
}  
}

module.exports.cadastrar_user = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con);
    const model_admin = new app.app.models.model_admin(con);
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("senha", "Voce deve preencher o senha").notEmpty();
    req.assert("senha", "O campo senha deve conter maid de 8 digitos").len(8, 32);
    req.assert("tipo_usuario", "Voce deve preencher o campo do tipo de usuario").notEmpty();
    let desvio = req.validationErrors();
    if(desvio){
        res.render("admin/usuario/cadastrar_user.ejs", {erro:desvio, usuario:dados});
        return;
    }    
    let email = await model_user.post_user_by_email(dados);
    if(email.length != 0){
        email = [{msg:"Email já está sendo ultilizado"}];
        res.render("admin/usuario/cadastrar_user.ejs", {erro:email, usuario:dados});
        return;
    }else{
        let cadastrar = await model_admin.cadastrar_user(dados);
        if(cadastrar){
            res.redirect("/administrador");
        return;
        }else{
            desvio = [{msg:"Erro ao cadastrar usuario"}];
            res.render("admin/usuario/cadastrar_user.ejs",{erro:desvio[0], usuario:dados});
        return;
        }  
    }
}else{
    res.redirect("/")
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

module.exports.alterar_usuario = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_user = new app.app.models.model_user(con);
    const model_admin = new app.app.models.model_admin(con);
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("tipo_usuario", "Voce deve preencher o campo do tipo de usuario").notEmpty();
    let desvio = req.validationErrors();
        if(desvio){
            res.render("user/alterar.ejs", {erro:desvio, usuario:dados});
            return;
        }else{
            let email = await model_user.post_user_by_email(dados.email);
            if(email.length != 0){
                email = [{msg:"Email já está sendo ultilizado"}];
                res.render("user/editar_user.ejs", {erro:email, usuario:dados});
                return;
            }else{
                let alterar = await model_admin.update_user(dados);
                if(alterar){
                res.redirect("/administrador");
                return;
                }else{
                    alterar = [{msg:"Erro ao alterar dados"}];
                    res.render("user/editar_user.ejs", {erro:alterar[0], usuario:dados});
                    return;
                }
            }  
        }
}else{
    res.redirect("/");
    return;
}
}

module.exports.tela_cadastrar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == 1){
    res.render("admin/fornecedor/cadastrar_forn.ejs",{erro: {}, fornecedor:{}})
}else{
    res.redirect("/");
    return;
}  
}

module.exports.cadastrar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    req.assert("nome", "Voce deve preencher o nome").notEmpty();
    req.assert("email", "Voce deve preencher o email").notEmpty();
    req.assert("cnpj", "Voce deve preencher o senha").notEmpty();
    req.assert("cnpj", "O campo senha deve conter maid de 8 digitos").len(11)
    let desvio = req.validationErrors();
    if(desvio){
        res.render("admin/fornecedor/cadastrar_forn.ejs", {erro:desvio, fornecedor:dados});
        return;
    }    
    let _email = await model_admin.select_email(dados.email);
    console.log(_email)
    if(_email.length != 0){
        _email = [{msg:"Email já está sendo ultilizado"}];
        res.render("admin/fornecedor/cadastrar_forn.ejs", {erro:_email, fornecedor:dados});
    }else{
        console.log("cheguei aqui")
        let cadastrar = await model_admin.cadastrar_fornecedor(dados);
        if(cadastrar){
            res.redirect("/administrador");
        return;
        }else{
            desvio = [{msg:"Erro ao cadastrar produto"}];
            res.render("admin/fornecedor/cadastrar_forn.ejs",{erro:desvio[0], fornecedor:dados});
        return;
        } 
    }
}else{
    res.redirect("/");
}
}

module.exports.tela_editar_fornecedor = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 1){
    let id = req.body.id_fornecedor;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const usuario = await model_admin.listar_fornecedores(id);
    res.render("admin/fornecedor/editar_forn.ejs", {erro : {}, usuario : usuario[0]});
    return;
}else{
    res.redirect("/");
    return;
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
    let desvio = req.validationErrors();
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
                res.render("user/editar_forn.ejs", {erro:alterar[0], usuario:dados});
                return;
            }
        }  
    }
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
        res.render("admin/produtos/cadastrar_produtos.ejs", {erro:{},  prod: {}, fornecedor: fornecedor});
    return;
    }else{
        res.render("admin/produtos/cadastrar_produtos.ejs",{erro:{},  prod: {}, fornecedor: fornecedor});   
    return;     
    }
}else{
    res.redirect("/");
    return;
}  
}

module.exports.cadastrar_prod = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const model_cardapio = new app.app.models.model_cardapio(con);
    req.assert("descr", "Voce deve preencher o nome").notEmpty();
    req.assert("preco", "Voce deve preencher o preço").notEmpty();
    req.assert("fornecedor", "Voce deve preencher o campo de fornecedor").notEmpty();
    let desvio = req.validationErrors();
    if(desvio){
        let fornecedor = await model_admin.listar_fornecedores();    
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/produtos/cadastrar_produtos.ejs", {erro:desvio, prod:dados, fornecedor: fornecedor[0]});
            return;
        }else{
            res.render("admin/produtos/cadastrar_produtos.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
            return;       
        }
    }
    let produto = await model_cardapio.cadastrar_prod(dados);
    if(produto){
        res.redirect("/administrador")
          
    }else{
        desvio = [{msg:"Erro ao alterar produto"}];
        let fornecedor = await model_admin.listar_fornecedores();    
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/produtos/editar_prod.ejs", {erro:desvio, prod:dados, fornecedor: fornecedor});
            return;
        }else{
            res.render("admin/produtos/editar_prod.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
            return;       
        }
    }
}else{
    res.redirect("/")
}
}

module.exports.tela_editar_prod = async function(app, req, res){
let tipo_user = req.session.id_tipo
if(tipo_user == 1){
    const id = req.body.id_prod;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const model_cardapio = new app.app.models.model_cardapio(con);
    let fornecedor = await model_admin.listar_fornecedores();
    let prod = await model_cardapio.post_listar_produto(id)
    if(!fornecedor){
        fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
        res.render("admin/produtos/editar_produto.ejs", {erro:{}, prod: prod, fornecedor: fornecedor[0]});
    return;
    }else{ 
        res.render("admin/produtos/editar_produto.ejs",{erro:{}, prod: prod, fornecedor: fornecedor});   
    return;     
    }
}else{
    res.redirect("/");
    return;
}   
}
    
module.exports.alterar_prod = async function(app, req, res){
let tipo_user = req.session.id_tipo;
if(tipo_user == "1"){
    const dados = req.body;
    const con = app.config.con_server;
    const model_admin = new app.app.models.model_admin(con);
    const model_cardapio = new app.app.models.model_cardapio(con);
    req.assert("descr", "Voce deve preencher o nome").notEmpty();
    req.assert("preco", "Voce deve preencher o preço").notEmpty();
    req.assert("fornecedor", "Voce deve preencher o campo de fornecedor").notEmpty();
    let desvio = req.validationErrors();
    if(desvio){
        let fornecedor = await model_admin.listar_fornecedores();    
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/produtos/editar_produto.ejs", {erro:desvio, prod:dados, fornecedor: fornecedor[0]});
            return;
        }else{
            res.render("admin/produtos/editar_produto.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
            return;       
        }
    }
    let produto = await model_cardapio.alterar_prod(dados) ;
    if(produto){
        res.redirect("/administrador")
        return;
    }else{
        desvio = [{msg:"Erro ao alterar produto"}];
        let fornecedor = await model_admin.listar_fornecedores();    
        if(!fornecedor){
            fornecedor = [{msg:"Erro ao carregar lista de fornecedores"}];
            res.render("admin/produtos/editar_prod.ejs", {erro:desvio, prod:dados, fornecedor: fornecedor[0]});
            return;
        }else{
            res.render("admin/produtos/editar_prod.ejs",{erro:desvio, prod:dados, fornecedor: fornecedor});
            return;       
        }
    }
}else{
    res.redirect("/");
    return;
}
}