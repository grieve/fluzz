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
    sockets: {
        'admin:start': 'onSocket',
        'admin:end': 'onSocket',
        'admin:next': 'onSocket',
        'admin:answer': 'onSocket'
    },
    initialize: function() {
        this.context = {
            quiz: window.boot.active,
            roundEnded: true
        };
    },
    render: function() {
        console.log(this.context);
        this.$el.html(tmpl(this.context));
    },
    onButtonStart: function() {
        this.context.roundEnded = false;
        State.socket.emit('admin:start');
    },
    onButtonAnswer: function() {
        this.context.roundEnded = true;
        State.socket.emit('admin:answer');
        this.render();
    },
    onButtonNext: function() {
        this.context.roundEnded = false;
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
