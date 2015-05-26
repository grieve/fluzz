'use strict';

var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./question.hbs');

var QuestionView = BaseView.extend({
    initialize: function() {
        this.context = {
            question: State.quiz.questions[0]
        };
        State.socket.on('fluzz:question', this.onQuestion.bind(this));
    },
    render: function() {
        this.$el.html(tmpl());
    },
    onQuestion: function(question) {
        this.context.question = question;
        this.render();
    }
});

module.exports = QuestionView;
