'use strict';

var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./controls.hbs');
var alert = require('../../shared/views/alert');


var Controls = BaseView.extend({
    events: {
        'click #start': 'onButtonStart',
        'click #answer': 'onButtonAnswer',
        'click #next': 'onButtonNext',
        'click #end': 'onButtonEnd'
    },
    initialize: function() {
        this.context = {
            quiz: window.boot.active
        };

        var onSocket = this.onSocket.bind(this);
        State.socket.on('admin:start', onSocket);
        State.socket.on('admin:end', onSocket);
        State.socket.on('admin:next', onSocket);
        State.socket.on('admin:answer', onSocket);
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    onButtonStart: function() {
        State.socket.emit('admin:start');
    },
    onButtonAnswer: function() {
        State.socket.emit('admin:answer');
    },
    onButtonNext: function() {
        State.socket.emit('admin:next');
    },
    onButtonEnd: function() {
        State.socket.emit('admin:end');
    },
    onSocket: function(quiz) {
        console.log(quiz);
        quiz = quiz || {};
        console.log(quiz);

        if ('errors' in quiz) {
            alert('danger', quiz.errors);
        }

        else {
            this.context.quiz = quiz;
            this.render();
        }
    }
});

module.exports = Controls;
