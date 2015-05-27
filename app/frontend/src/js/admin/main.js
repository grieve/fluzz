'use strict';

var State = require('./state');
var Controls = require('./views/controls');
var controls = new Controls({socket: State.socket});
controls.render();
