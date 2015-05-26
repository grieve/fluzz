'use strict';

var Bb = require('backbone');
var Views = {
    waiting: require('./views/waiting'),
    quiz: require('./views/question'),
    finished: require('./views/finished')
};

var Router = Bb.Router.extend({
    initialize: function() {
        this.currentView = null;
    },
    routes: {
        'live/wait': 'wait',
        'live/quiz/:question': 'quiz',
        'live/finish': 'finish',
        '*actions': 'wildcard'
    },
    quiz: function(question) {
        console.log(question);
        this.transition(new Views.quiz());
    },
    wait: function() {
        this.transition(new Views.waiting());
    },
    finish: function() {
        this.transition(new Views.finished());
    },
    wildcard: function() {
        this.navigate('live/wait', {trigger: true});
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
