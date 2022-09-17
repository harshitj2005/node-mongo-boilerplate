"use strict";

var userController = require("app/controllers/userController");
var authenticate = require("app/middleware/authenticate");

module.exports = function(app) {
    app.get("/authenticate", authenticate.jwtAuth, userController.authenticate);
    app.post("/register", userController.register);
    app.post("/login", userController.login);
};

