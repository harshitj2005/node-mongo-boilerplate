"use strict";

/**
 * Module dependencies.
 */
var fs = require('fs'),
    express = require('express'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    _ = require("lodash"),
    glob = require("glob"),
    logger = require('morgan'),
    passport = require('passport'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    httpStatus = require('http-status'),
    path = require('path');
    
var config = require("config/config");
var winston = require("config/winston");
var strategy = require("app/middleware/strategy");
const ApiError = require("app/helpers/ApiErrors");
const { errorConverter, errorHandler } = require('app/middleware/errors');

module.exports = function(app) {

    app.set("showStackError", true);    
    
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader("Content-Type"));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + "/public/img/icons/favicon.ico"));
    app.use(express.static(config.root + "/public"));

    //Don't use logger for test env
    if (config.NODE_ENV !== "test") {
        app.use(logger("dev", { "stream": winston.stream.write }));
    }
    // app.set('view engine', 'jade');
    //Enable jsonp
    app.enable("jsonp callback");

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(methodOverride());

    passport.use(strategy)
    app.use(passport.initialize());
    // Globbing routing files
    getGlobbedFiles("./app/routes/**/*.js").forEach(function(routePath) {
      require(path.resolve(routePath))(app);
    });

    app.use((req, res, next) => {
        next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });

    // convert error to ApiError, if needed
    app.use(errorConverter);

    // handle error
    app.use(errorHandler);

};

function getGlobbedFiles (globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp("^(?:[a-z]+:)?\/\/", "i");   // eslint-disable-line

	// The output array
	var output = [];

	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob(globPatterns, { sync: true });

			if (removeRoot) {
				files = files.map(function(file) {
					return file.replace(removeRoot, "");
				});
			}

			output = _.union(output, files);
		}
	}

	return output;
}