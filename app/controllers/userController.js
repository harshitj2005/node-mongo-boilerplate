"use strict";

/**
 * Module dependencies.
 */
var jwt = require("jsonwebtoken");
const httpStatus = require('http-status');
var config = require("config/config");
var logger = require("config/winston");
const User = require("../models/user");
const ApiError = require("../helpers/ApiErrors")

var apiFunctions = {
    authenticate: (req, res) => {
        res.status(200).jsonp({ info: "This is authenticate" });
    },
    register: (req, res) => {
        let response = {
            responseCode:200,
            message:"",
            data:{}
        }
        User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        })
        .then((user) => {
            var token = jwt.sign({ id: user.id }, config.secretKey, {
                expiresIn: 86400
            });
            response.responseCode = 200;
            response.data = { id: user.id, token: token };
            return res.status(response.responseCode).jsonp(response);
        }, (err) => {
            logger.error("error occured in user create",err);
            response.responseCode = 500;
            response.message = err && err.message || "something went wrong";
            return res.status(response.responseCode).jsonp(response);
        });
    },
    login: async (req, res) => {
        let response = {
            responseCode:200,
            message:"",
            data:{}
        }
        const email = req.body.email;
        const password = req.body.password;
        try {
            let user = await User.findOne({ email });
            if (!user || !(await user.isPasswordMatch(password))) {
                response.responseCode = 401;
                response.message = "Incorrect email or password";
                return res.status(response.responseCode).jsonp(response);
            } else {
                var token = jwt.sign({ id: user.id }, config.secretKey, {
                    expiresIn: 86400
                });
                response.responseCode = 200;
                response.data = { id: user.id, token: token };
                return res.status(response.responseCode).jsonp(response);
            }
        } catch (e) {
            logger.error("error occured in user login",e);
            response.responseCode = 500;
            response.message = e && e.message || "something went wrong";
            return res.status(response.responseCode).jsonp(response);
        }
    }
}
module.exports = apiFunctions