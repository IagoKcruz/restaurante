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
        let delete_quant = await model_pedido.delete_cart(dados.detalhe_pedido, dados.pedido, dados.produto, dados.quant);
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
        let valor_total = 0;
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
            console.log(cart_pedido)
            if (cart_pedido.length <= 0) {
                cart_pedido = [{ msg: "Nenhum produto encontrado" }];
                prod = [{ msg: "Nenhum produto encontrado" }];
                valor_total = [{ msg: "Nenhum produto encontrado" }];
                render_carrinho(req, res, app, cart_pedido, prod, valor_total, carrinho);
                return;
            } else {
                for (let i = 0; cart_pedido.length > i; i++) {
                    prod[i] = await model_pedido.unico_produto_cart(pedido, cart_pedido[i].id_produto)
                    valor_total = valor_total + (cart_pedido[i].quantidade * prod[i][0].preco)
                }
                cart_pedido = await model_pedido.cart_pedido(pedido);
                if (prod.length <= 0) {
                    cart_pedido = [{ msg: "Erro ao carregar pedido" }];
                    prod = [{ msg: "Erro ao carregar produto" }];
                    render_carrinho(req, res, app, cart_pedido, prod, valor_total, carrinho);
                } else {
                    render_carrinho(req, res, app, cart_pedido, prod, valor_total, carrinho);
                }
            }
        }
    } else {
        res.redirect("/")
    }

}

async function render_carrinho(req, res, app, cart_pedido, prod, valor_total, carrinho) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        if (carrinho == 1) {
            res.render("cardapio/finalizar.ejs", { pedido: cart_pedido, prod: prod, status: {}, valor: valor_total });
        } else {
            res.render("cardapio/cart.ejs", { pedido: cart_pedido, prod: prod, valor: valor_total });
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
                cart_pedido = [{ msg: "" }]
                prod = [{ msg: "" }]
                update_status = [{ msg: "Erro ao enviar pedido" }]
                res.render("cardapio/finalizar.ejs", { pedido: cart_pedido, prod: prod, status: update_status[0] });
            } else {
                let pedido_em_andamento = await model_pedido.pedido_em_andamento(user, pedido[0].id);
                cart_pedido = await model_pedido.cart_pedido(pedido_em_andamento[0].id);
                for (let i = 0; cart_pedido.length > i; i++) {
                    prod[i] = await model_pedido.unico_produto_cart(pedido_em_andamento[0].id, cart_pedido[i].id_produto);
                }
                update_status = [{ msg: "Pedido enviado" }]
                res.render("cardapio/finalizar.ejs", { pedido: cart_pedido, prod: prod, status: update_status[0] });
            }
        }
    } else {
        res.redirect("/")
    }
}

module.exports.pedidos_usuario = async function (app, req, res) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 2) {
        let id = req.session.id_usuario;
        let lista_de_pedidos = []
        let prod = [];
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let pedidos = await model_pedido.pedidos_usuario(id);
        if (!pedidos) {
            render_pedido = {
                id: "Você não possue pedidos",
                status: "",
                quantidade: "",
                valor: ""
            }
            lista_de_pedidos.push(render_pedido)
            pedidos = await model_pedido.pedidos_usuario(id);
        } else {
            for (let i = 0; i < pedidos.length; i++) {
                let pedido = req.session.id_pedido = pedidos[i].id;
                let cart_pedido = await model_pedido.cart_pedido(pedido);
                if (cart_pedido.length <= 0) {
                    let render_pedido = {
                        status: "Erro ao carregar pedido",
                        quantidade: "Erro ao carregar pedido",
                        valor: "Erro ao carregar pedido"
                    }
                    lista_de_pedidos.push(render_pedido)
                } else {
                    let status;
                    let quant = 0;
                    let valor_total = 0;
                    for (let j = 0; cart_pedido.length > j; j++) {
                        prod[j] = await model_pedido.unico_produto_cart(pedido, cart_pedido[j].id_produto);
                        status = cart_pedido[j].descr
                        quant = quant + cart_pedido[j].quantidade
                        valor_total = valor_total + (cart_pedido[j].quantidade * prod[j][0].preco)
                    }
                    if (!prod || !status) {
                        render_pedido = {
                            id: "Erro ao carregar pedido",
                            status: "Erro ao carregar pedido",
                            quantidade: "Erro ao carregar pedido",
                            valor: "Erro ao carregar pedido"
                        }
                        lista_de_pedidos.push(render_pedido)
                    } else {
                        render_pedido = {
                            id: pedidos[i].id,
                            status: status,
                            quantidade: quant,
                            valor: valor_total
                        }
                        lista_de_pedidos.push(render_pedido)
                    }
                }
            }
            res.render("user/listar_pedido", { pedidos: lista_de_pedidos })
            return;
        }

    } else {
        res.redirect("/")
    }
}

module.exports.pedidos = async function (app, req, res) {
    let tipo_user = req.session.id_tipo;
    if (tipo_user == 1) {
        let rejeitados;
        let render_pedido;
        let render_pedido_rejeitados;
        let lista_de_pedidos = []
        let lista_de_pedidos_rejeitados = []
        let prod = [];
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let pedidos = await model_pedido.pedidos();
        if (!pedidos) {
            render_pedido = {
                id: "Não existe nenhum pedido",
                status: "",
                quantidade: "",
                valor: ""
            }
            lista_de_pedidos.push(render_pedido)
            pedidos = await model_pedido.pedidos();
        } else {
            for (let i = 0; i < pedidos.length; i++) {
                let cart_pedido = await model_pedido.cart_pedido(pedidos[i].id);
                let nome;
                let status;
                let quant = 0;
                let valor_total = 0;
                for (let j = 0; cart_pedido.length > j; j++) {
                    prod[j] = await model_pedido.unico_produto_cart(pedidos[i].id, cart_pedido[j].id_produto);
                    nome = cart_pedido[j].nome
                    status = cart_pedido[j].descr
                    valor_total = (cart_pedido[j].quantidade * prod[j][0].preco)
                    quant = quant + cart_pedido[j].quantidade
                }
                if (!prod || !status) {
                    render_pedido = {
                        nome: "Erro ao carregar pedido",
                        id: "Erro ao carregar pedido",
                        status: "Erro ao carregar pedido",
                        quantidade: "Erro ao carregar pedido",
                        valor: "Erro ao carregar pedido"
                    }
                    lista_de_pedidos.push(render_pedido)
                } else {
                    render_pedido = {
                        nome: nome,
                        id: pedidos[i].id,
                        status: status,
                        quantidade: quant,
                        valor: valor_total
                    }
                    lista_de_pedidos.push(render_pedido)
                }
            }
            for (let i = 0; i < pedidos.length; i++) {
                let cart_pedido_rejeitados = await model_pedido.cart_pedido_rejeitado(pedidos[i].id);
                let nome;
                let status;
                let quant = 0;
                let valor_total = 0;
                let status_prod;
                for (let j = 0; cart_pedido_rejeitados.length > j; j++) {
                    prod[j] = await model_pedido.unico_produto_cart_rejeitado(pedidos[i].id, cart_pedido_rejeitados[j].id_produto);
                    nome = cart_pedido_rejeitados[j].nome
                    status = cart_pedido_rejeitados[j].descr
                    valor_total = (cart_pedido_rejeitados[j].quantidade * prod[j][0].preco)
                    quant = quant + cart_pedido_rejeitados[j].quantidade
                    status_prod = cart_pedido_rejeitados[j].status_prod
                }
                if (!prod || !status) {
                    render_pedido_rejeitados = {
                        nome: "Erro ao carregar pedido",
                        id: "Erro ao carregar pedido",
                        status: "Erro ao carregar pedido",
                        quantidade: "Erro ao carregar pedido",
                        valor: "Erro ao carregar pedido",
                        status_prod: ""
                    }
                    lista_de_pedidos_rejeitados.push(render_pedido_rejeitados)
                } else {
                    render_pedido = {
                        nome: nome,
                        id: pedidos[i].id,
                        status: status,
                        quantidade: quant,
                        valor: valor_total,
                        status_prod: status_prod
                    }
                    lista_de_pedidos_rejeitados.push(render_pedido_rejeitados)
                }
            }
            res.render("admin/pedidos/pedidos", { pedidos: lista_de_pedidos, pedidos_rejeitados: lista_de_pedidos_rejeitados })
            return;
        }
    } else {
        res.redirect("/")
    }
}

module.exports.gerenciar_pedidos = async function (app, req, res) {
    let tipo_user = req.session.id_tipo
    if (tipo_user == 1) {
        const dados = req.body;
        const con = app.config.con_server;
        const model_pedido = new app.app.models.model_cart(con);
        let adm_pedido = await model_pedido.gerenciar(dados.action, dados.pedido);
        if (adm_pedido) {
            res.redirect("/page_pedidos")
        }
    } else {
        res.redirect("/")
    }
}