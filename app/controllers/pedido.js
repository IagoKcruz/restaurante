module.exports.open_pedido = async function (app, req, res) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        const dados = req.body;
        let id = req.session.id_usuario;
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let aberto = await model_pedido.pedido_aberto(id);
        if (aberto == 0) {
            let create = await model_pedido.create_pedido(id);
            if (!create) {
                create_pedido = [{ msg: "Algo deu errado ao adicionar um pedido ao carrinho" }];
                res.render("cardapio/cart.ejs", { pedido: create_pedido, prod: create_pedido });
            }
            aberto = await model_pedido.pedido_aberto(id);
        }
        let pedido = req.session.id_pedido = aberto[0].id;
        add_cart(app, req, res, pedido, dados);

    } else {
        res.redirect("/");
    }

}

async function add_cart(app, req, res, id, dados) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let tem_produto = await model_pedido.select_tem_produto(id, dados.id_prod);
        if (tem_produto.length > 0) {
            let add_quant = await model_pedido.alterar_quant(id, dados.id_prod);
            if (!add_quant) {
                add_quant = [{ msg: "Algo deu errado ao alterar quantidade do produto do carrinho" }];
                res.render("cardapio/cart.ejs", { pedido: add_quant, prod: add_quant });
            } else {
                res.redirect("/carrinho");
            }
        } else {
            let create_pedido = await model_pedido.detalhe_pedido(id, dados);
            if (create_pedido > 0) {
                create_pedido = [{ msg: "Algo deu errado ao adicionar o produto ao carrinho" }];
                res.render("cardapio/cart.ejs", { pedido: create_pedido, prod: create_pedido });
            } else {
                res.redirect("/carrinho");
            }
        }
    } else {
        res.redirect("/");
    }

}

module.exports.editar_item_cart = async function (app, req, res) {
    let tipo_user = req.session.id_tipo
    if (tipo_user == 2) {
        const dados = req.body;
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let update_quant = await model_pedido.quant_cart(dados.pedido, dados.produto, dados.quant);
        if (update_quant) {
            res.redirect("/carrinho")
        }
    } else {
        res.redirect("/")
    }
}

module.exports.deletar_item_cart = async function (app, req, res) {
    let tipo_user = req.session.id_tipo
    if (tipo_user == 2) {
        const dados = req.body;
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let delete_quant = await model_pedido.delete_cart(dados.detalhe_pedido, dados.pedido, dados.produto);
        if (delete_quant) {
            res.redirect("/carrinho")
        }
    } else {
        res.redirect("/")
    }

}

module.exports.open_cart = async function (app, req, res) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        const carrinho = req.body.cart
        let id = req.session.id_usuario;
        let prod = [];
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let aberto = await model_pedido.pedido_aberto(id);
        if (aberto.length == 0) {
            let create = await model_pedido.create_pedido(id);
            if (create) {
                aberto = await model_pedido.pedido_aberto(id);
            }
        } else {
            let pedido = req.session.id_pedido = aberto[0].id;
            let cart_pedido = await model_pedido.cart_pedido(pedido);
            if (cart_pedido.length <= 0) {
                cart_pedido = [{ msg: "Nenhum produto encontrado" }];
                prod = [{ msg: "Nenhum produto encontrado" }];
                render_carrinho(req, res, app, cart_pedido, prod, carrinho);
                return;
            } else {
                for (let i = 0; cart_pedido.length > i; i++) {
                    prod[i] = await model_pedido.unico_produto_cart(pedido, cart_pedido[i].id_produto);
                }
                cart_pedido = await model_pedido.cart_pedido(pedido);
                if (prod.length <= 0) {
                    cart_pedido = [{ msg: "Erro ao carregar pedido" }];
                    prod = [{ msg: "Erro ao carregar produto" }];
                    render_carrinho(req, res, app, cart_pedido, prod, carrinho);
                } else {
                    render_carrinho(req, res, app, cart_pedido, prod, carrinho);
                }
            }
        }
    } else {
        res.redirect("/")
    }

}

async function render_carrinho(req, res, app, cart_pedido, prod, carrinho) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        if (carrinho == 1) {
            res.render("cardapio/finalizar.ejs", { pedido: cart_pedido, prod: prod, status: {} });
        } else {
            res.render("cardapio/cart.ejs", { pedido: cart_pedido, prod: prod });
        }

    } else {
        res.redirect("/")
    }
}

module.exports.finalizar = async function (app, req, res) {
    let tipo_user = req.session.id_tipo
    if (tipo_user == 2) {
        let prod = [];
        let user = req.session.id_usuario;
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let pedido = await model_pedido.pedido_aberto(user);
        if (pedido) {
            const update = await model_pedido.em_andamento(pedido[0].id, pedido[0].id_usuario)
            if (!update) {
                console.log("não deu")
            } else {
                let pedido_em_andamento = await model_pedido.pedido_em_andamento(user, pedido[0].id);
                cart_pedido = await model_pedido.cart_pedido(pedido_em_andamento[0].id);
                for (let i = 0; cart_pedido.length > i; i++) {
                    prod[i] = await model_pedido.unico_produto_cart(pedido_em_andamento[0].id, cart_pedido[i].id_produto);
                }
                console.table("aqui"+cart_pedido)
                console.table("aqui"+pedido_em_andamento)
                update_status = [{ msg: "Pedido enviado" }]
                res.render("cardapio/finalizar.ejs", {pedido: cart_pedido, prod: prod, status: update_status[0] });
            }
        }
    } else {
        res.redirect("/")
    }
}