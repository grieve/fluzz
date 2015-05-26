'use strict';

var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./waiting.hbs');

var WaitingView = BaseView.extend({
    initialize: function() {
        State.socket.on('fluzz:start', this.onStart.bind(this));
        State.socket.on('fluzz:presenter', this.onJoin.bind(this));
    },
    render: function() {
        this.$el.html(tmpl());
        State.socket.emit('fluzz:presenter');
    },
    onStart: function(quiz) {
        console.log(quiz);
        State.quiz = quiz;
        State.router.navigate('live/quiz/0', {trigger: true});
    },
    onJoin: function(quiz) {
        if (quiz) {
            State.quiz = quiz;
            State.router.navigate('live/quiz/0', {trigger: true});
        }
    }
});

module.exports = WaitingView;
