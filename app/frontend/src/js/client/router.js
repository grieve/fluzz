'use strict';

var Bb = require('backbone');
var Views = {
    login: require('./views/login'),
    waiting: require('./views/waiting'),
    controller: require('./views/controller'),
    winner: require('./views/winner'),
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
        'login': 'login',
        'quiz': 'quiz',
        'wait': 'wait',
        'winner': 'winner',
        'finish': 'finish',
        '*actions': 'wildcard'
    },
    login: function() {
        this.transition(new Views.login(this.defaults));
    },
    quiz: function() {
        this.transition(new Views.controller(this.defaults));
    },
    wait: function() {
        this.transition(new Views.waiting(this.defaults));
    },
    winner: function() {
        this.transition(new Views.winner(this.defaults));
    },
    finish: function() {
        this.transition(new Views.finished(this.defaults));
    },
    wildcard: function() {
        this.navigate('login', {trigger: true});
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
