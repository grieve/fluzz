'use strict';

var Bb = require('backbone');
var Router = require('./router');
var State = require('./state');
State.router = Router;
Bb.history.start({pushState: true});
