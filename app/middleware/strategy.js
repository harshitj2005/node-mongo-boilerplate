"use strict";

/**
 * Module dependencies.
 */

var passportJWT = require("passport-jwt");
var config = require("config/config");
var logger = require("config/winston");
const User = require("../models/user")

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.secretKey;

var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  logger.info("payload received in strategy", jwt_payload);
  let user  = await User.findById(jwt_payload.id)
  if (user) {
    next(null, user);
  } else {
    next(true, {}, { message:"invalid user token" });
  }
});

module.exports = strategy;