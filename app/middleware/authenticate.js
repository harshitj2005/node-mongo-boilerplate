"use strict";

/**
 * Module dependencies.
 */

var passport = require("passport");

var authenticate = {
    jwtAuth : (req, res, next) => {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            console.log(err, user, info)
            if (err || !user) {
                return res.status(401).jsonp({
                    responseCode:401,
                    message: info ? info.message : "Invalid user token"
                });
            }
            next();
        })(req, res);
    }
};

module.exports = authenticate;