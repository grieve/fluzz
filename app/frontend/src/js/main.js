'use strict';

var io = require('exports?io!./libs/socket.io.min');

var socket = io.connect();

socket.on('response', function(msg) {
    console.log('Received: ' + msg.data);
});

setInterval(function() {
    console.log('send-event');
    socket.emit('event', {});
}, 2000);

setInterval(function() {
    console.log('send-broadcast');
    socket.emit('broadcast', {});
}, 4000);
