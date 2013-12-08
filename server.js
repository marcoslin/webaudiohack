#!/usr/bin/env node

var express = require("express"),
    app = express(),
    http_port = 8080,
    server = app.listen(http_port),
    io = require("socket.io").listen(server, { log: false }),
    multimeter = require('multimeter'),
    multi = multimeter(process);

app.use(express.static(__dirname + '/www'));


// Initialize Volume Meter
multi.write("Volume Meter:\n\n");
    
multi.write("Left:\n");
var left_bar = multi.rel(8, 0, {width: 50, empty : { text : ' ' }});
left_bar.percent(0);

multi.write("Right:\n");
var right_bar = multi.rel(8, 1, {width: 50, empty : { text : ' ' }});
right_bar.percent(0);

multi.offset += 1; 

// Listen to socket io messages
io.on("connection", function (socket) {
    socket.on("volume_info", function (data) {
        left_bar.percent(data.left);
        right_bar.percent(data.right);
    });
});

