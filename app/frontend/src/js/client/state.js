'use strict';

var io = require('exports?io!../libs/socket.io.min');

var State = function() {
    var socket = io.connect();
    this.socket = socket;

    this.heartbeat = setInterval(this.sendBeat.bind(this), 1000);
};

State.prototype.sendBeat = function() {
    this.socket.emit('fluzz:heartbeat');
};

module.exports = new State();
