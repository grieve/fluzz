'use strict';

var $ = require('jquery');
var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./question.hbs');

var QuestionView = BaseView.extend({
    colorMap: [
        'info',
        'primary',
        'success',
        'danger'
    ],
    initialize: function() {
        this.context = {
            question: State.quiz.questions[State.quiz.current_question]
        };
        State.socket.on('fluzz:question', this.onQuestion.bind(this));
        State.socket.on('fluzz:result', this.onResult.bind(this));
        State.socket.on('fluzz:end', this.onEnd.bind(this));
        State.socket.on('fluzz:players', this.onPlayers.bind(this));
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    onQuestion: function(question) {
        this.context.question = question;
        this.render();
    },
    onResult: function(result) {
        for (var idx = 0; idx < this.colorMap.length; idx++) {
            if (idx === result.answer) {
                continue;
            }
            $('.btn-' + this.colorMap[idx]).parent().animate({opacity: 0.3});
        }
    },
    onEnd: function() {
        State.router.navigate('live/finish', {trigger: true});
    },
    onPlayers: function(players) {
        for (var idx = 0; idx < players.players.length; idx++) {
            players.players[idx].answer = this.colorMap[
                players.players[idx].answer
            ]
        }
        this.context.players = players.players;
        this.render();
    }
});

module.exports = QuestionView;
