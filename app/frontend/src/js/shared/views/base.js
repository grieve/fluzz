'use strict';

var Bb = require('backbone');


var BaseView = Bb.View.extend({
    el: 'main',
    enter: function(callback) {
        callback();
    },
    exit: function(callback) {
        callback();
    },
    destroy: function(callback) {
        this.exit(callback);
    }
});

module.exports = BaseView;
