// Custom web app provifding access to phpLDAPAdmin web user
// interface at localhost:6700.
//
// Copyright (C) 2016 Teleste Corporation

"use strict";

var webui = require("../routes/webui");
var monitor = require("../routes/monitor");
var loadConfig = require("../models/config");
var Q = require("q");
var express = require("express");
var app = express();

GLOBAL.app = app;

function publishConfig (config) {
    return Q.fcall(function () {
        app.config = config;
        return app;
    });
}

function addRoutes () {
    return Q.fcall(function () {
	app.use(express.static(__dirname + "/../public"));
	app.use("/ldap-admin", webui);
	app.use("/monitor", monitor);
        return app;
    });
}

loadConfig(process.argv[2])
    .then(publishConfig)
    .then(addRoutes)
    .then(function () {
	var server = app.listen(app.config.listenPort, app.config.listenAddress, function () {
	    console.log("Listening on %s:%s", server.address().address, server.address().port);
	});
	server.on("error", function (err) {
	    console.error("Server failure:", err.message);
	    process.exit(2);
	});
    })
    .fail(function (err) {
        console.error("Server startup failure:", err.message);
    })
    .done();

// Upstart 'reload' workaround, effectively suppressing it.
process.on("SIGHUP", function () {
    console.log("SIGHUP ignored");
});
