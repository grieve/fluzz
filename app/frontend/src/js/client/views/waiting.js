'use strict';

var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./waiting.hbs');

var WaitingView = BaseView.extend({
    sockets: {
        'fluzz:start once': 'onStart'
    },
    render: function() {
        this.$el.html(tmpl());
    },
    onStart: function() {
        State.router.navigate('quiz', {trigger: true});
    }
});

module.exports = WaitingView;
