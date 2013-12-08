#!/usr/bin/env node

var express = require("express"),
    app = express(),
    http_port = 8080,
    server = app.listen(http_port),
    io = require("socket.io").listen(server, { log: false }),
    multimeter = require('multimeter'),
    multi = multimeter(process);

app.use(express.static(__dirname + '/www'));

multi.write("Volume Meter:\n\n");
    
multi.write("Left:\n");
var left_bar = multi.rel(8, 0, {width: 50, empty : { text : ' ' }});
left_bar.percent(0);


multi.write("Right:\n");
var rbar = multi.rel(8, 1, {width: 50, empty : { text : ' ' }});
rbar.percent(0);

multi.offset += 1; 


io.on("connection", function (socket) {

    
    socket.on("message", function (message) {
        // console.log("Socket Message: " + message);
    });
    
    function normalizeVolume(volume) {
        if (volume > 100) {
            return 100;
        } else if (volume < 0) {
            return 0;
        } else {
            return volume;
        }
    }
    
    socket.on("sound_data", function (data) {
        //console.log("data: ", data);
        left_bar.percent(normalizeVolume(data.left), "");
        
        rbar.percent(normalizeVolume(data.right));
    });
    
});

