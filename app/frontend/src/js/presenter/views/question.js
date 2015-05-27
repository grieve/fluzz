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
    sockets: {
        'fluzz:question': 'onQuestion',
        'fluzz:result': 'onResult',
        'fluzz:end once': 'onEnd',
        'fluzz:players': 'onPlayers'
    },
    initialize: function() {
        this.context = {
            question: State.quiz.questions[State.quiz.current_question],
            correct: [true, true, true, true]
        };
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    onQuestion: function(question) {
        this.context.question = question;
        this.context.correct = [true, true, true, true];
        this.render();
    },
    onResult: function(result) {
        this.context.correct = [false, false, false, false];
        this.context.correct[result.answer] = true;
        this.render();
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
