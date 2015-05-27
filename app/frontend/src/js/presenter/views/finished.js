'use strict';

var BaseView = require('../../shared/views/base');
var tmpl = require('./finished.hbs');

var FinishedView = BaseView.extend({
    sockets: {
        'fluzz:players': 'onPlayers'
    },
    initialize: function() {
        this.context = {
            players: []
        };
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    onPlayers: function(data) {
        this.context.players = data.players.sort(function(a, b) {
            return b.score - a.score;
        });
        this.render();
    }
});

module.exports = FinishedView;
