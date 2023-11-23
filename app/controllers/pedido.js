module.exports.open_pedido = async function(app, req, res){
    const dados = req.body;
    let id = req.session.id_usuario;
    const con = app.config.con_server;
    const model_pedido = new app.app.models.model_cart(con)
    let aberto = await model_pedido.pedido_aberto(id);
    if(aberto == 0){
        console.log("NÃO TEM PEDIDO")
        let create = await model_pedido.create_pedido(id); 
        if(!create){
            console.log("DEU ERRADO")
        }
        aberto = await model_pedido.pedido_aberto(id); 
    }
    let pedido = req.session.id_pedido = aberto[0].id
    add_cart(app, req, res, pedido, dados);

}

async function add_cart(app, req, res, id, dados){
    const con = app.config.con_server;
    console.log(id, dados.id_prod)
    const model_pedido = new app.app.models.model_cart(con);
    let tem_produto = await model_pedido.select_tem_produto(id, dados.id_prod);
    console.log(tem_produto)
    if(tem_produto.length > 0){
        let add_quant = await model_pedido.alterar_quant(id, dados.id_prod);
        if(!add_quant){
            console.log("DEU MERDA")
        }
        let prod = await model_pedido.select_prod_cart(id)
        if(!prod){
            prod = {msg:"Erro ao carregar dados do produto"}
        }else{
            let cart_pedido = await model_pedido.cart_pedido(id, dados.id_prod);
            res.render("cardapio/cart.ejs", {pedido: cart_pedido, prod: prod})
        }
        return;
    }else{
        let create_pedido = await model_pedido.create_produto_pedido(id, dados);
        if(create_pedido > 0){
            console.log("DEU ERRADO => carrinho")
            create_pedido = [{msg: "Algo deu errado ao adicionar o produto ao carrinho"}]
        }
        let prod = await model_pedido.select_prod_cart(id)
        if(!prod){
            prod = {msg:"Erro ao carregar dados do produto"}
        }else{
            let cart_pedido = await model_pedido.cart_pedido(id);
            res.render("cardapio/cart.ejs", {pedido: cart_pedido, prod: prod})
        }
        return;        
    }

}

module.exports.open_cart = async function(app, req, res){
    const con = app.config.con_server;
    let id = req.session.id_usuario;
    const model_pedido = new app.app.models.model_cart(con)
    let select_pedido = await model_pedido.select_aberto(id);
    if(select_pedido == 0){
        console.log("NÃO TEM PEDIDO")
        let create = await model_pedido.create_pedido(id); 
        if(!create){
            console.log("DEU ERRADO")
        }
        select_pedido = await model_pedido.select_aberto(id);   
        let pedido = req.session.id_pedido = select_pedido[0].id
        const model_pedido = new app.app.models.model_cart(con);
        let info_pedido = await  model_pedido.select_pedido_cart(pedido)
        let prod = await model_pedido.select_prod_cart(pedido)
        if(!prod){
            prod = {msg:"Erro ao carregar dados do produto"}
        }
        res.render("cardapio/cart.ejs", {pedido: info_pedido, prod: prod})
    } 
        let pedido = req.session.id_pedido = select_pedido[0].id
        let info_pedido = await  model_pedido.select_pedido_cart(pedido)
        let prod = await model_pedido.select_prod_cart(pedido)
        if(!prod){
            prod = [{msg:"Erro ao carregar carrinho"}]
        }
        res.render("cardapio/cart.ejs", {pedido: info_pedido, prod: prod})        


}