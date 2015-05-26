'use strict';

var Bb = require('backbone');
var Views = {
    login: require('./views/login'),
    waiting: require('./views/waiting'),
    controller: require('./views/controller'),
    finished: require('./views/finished')
};

var Router = Bb.Router.extend({
    initialize: function() {
        this.currentView = null;
    },
    routes: {
        'login': 'login',
        'quiz': 'quiz',
        'wait': 'wait',
        'finish': 'finish',
        '*actions': 'wildcard'
    },
    login: function() {
        this.transition(new Views.login());
    },
    quiz: function() {
        this.transition(new Views.controller());
    },
    wait: function() {
        this.transition(new Views.waiting());
    },
    finish: function() {
        this.transition(new Views.finished());
    },
    wildcard: function() {
        this.navigate('login', {trigger: true});
    },
    transition: function(newView) {
        if (this.currentView != null) {
            var self = this;
            this.currentView.destroy(function() {
                self.currentView = newView;
                self.currentView.render();
            });
        }

        else {
            this.currentView = newView;
            this.currentView.render();
        }
    }
});

var router = new Router();
module.exports = router;
