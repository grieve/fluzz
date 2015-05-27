'use strict';

var Bb = require('backbone');
var Views = {
    waiting: require('./views/waiting'),
    quiz: require('./views/question'),
    finished: require('./views/finished')
};
var State = require('./state');

var Router = Bb.Router.extend({
    initialize: function() {
        this.currentView = null;
        this.defaults = {
            socket: State.socket
        };
    },
    routes: {
        'live/wait': 'wait',
        'live/quiz/:question': 'quiz',
        'live/finish': 'finish',
        '*actions': 'wildcard'
    },
    quiz: function(question) {
        console.log(question);
        this.transition(new Views.quiz(this.defaults));
    },
    wait: function() {
        this.transition(new Views.waiting(this.defaults));
    },
    finish: function() {
        this.transition(new Views.finished(this.defaults));
    },
    wildcard: function() {
        this.navigate('live/wait', {trigger: true});
    },
    transition: function(newView) {
        if (this.currentView != null) {
            this.currentView.remove();
        }
        this.currentView = newView;
        this.currentView.render();
    }
});

var router = new Router();
module.exports = router;
