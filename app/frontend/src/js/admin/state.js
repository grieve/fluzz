'use strict';

var io = require('exports?io!../libs/socket.io.min');

var State = function() {
    var socket = io.connect('/admin');
    this.socket = socket;
};

module.exports = new State();
