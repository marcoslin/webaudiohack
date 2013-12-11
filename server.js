#!/usr/bin/env node

// Configure Express Web Server
var express = require("express"),
    app = express(),
    proxy = require(__dirname + "/proxy.js")();

app.use(express.static(__dirname + '/www'));
app.get("/proxy", function (req, res) {
    if ( "url" in req.query ) {
        proxy.request(req.query.url, req, res);
    } else {
        res.status(500).send("Error: Expected url query string not provided.");
    }
});

// Start Express Web Server and setup SocketIO
var http_port = 8080,
    server = app.listen(http_port),
    ws = require('ws').Server,
    io = new ws({server: server}),
    multimeter = require('multimeter'),
    multi = multimeter(process);

io.on("connection", function (socket) {
    socket.on("message", function (json_string, flags) {
        var data = JSON.parse(json_string);
        left_bar.percent(data.left);
        right_bar.percent(data.right);
    });
});


// Initialize Volume Meter
multi.write("Open in Chrome or Firefox: http://localhost:" + http_port + "/\n\n");
multi.write("Volume Meter:\n\n");
    
multi.write("Left:\n");
var left_bar = multi.rel(8, 0, {width: 50, empty : { text : ' ' }});
left_bar.percent(0);

multi.write("Right:\n");
var right_bar = multi.rel(8, 1, {width: 50, empty : { text : ' ' }});
right_bar.percent(0);

multi.offset += 1; 


