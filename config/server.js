module.exports = function (){
    const express = require("express");
    const consign = require("consign");
    const body_parser = require("body-parser");
    const express_validator = require("express-validator");
    const express_session = require("express-session");
    const app = express();

    app.set("view engine", "ejs");
    app.set("views", "./app/views");

    app.use(body_parser.urlencoded({extended:true}));
    app.use(express_validator());
    app.use(express.static("app/public"));
    app.use(express_session({
        secret:"euamoamaria",
        resave:false,
        saveUninitialized:false
    }))

    consign()
        .include("app/rotas")
        .then("config/con_server.js")
        .then("app/models")
        .then("app/controllers")
        .into(app);
    return app;
}