'use strict';


var BaseView = require('../../shared/views/base');
var State = require('../state');

var tmpl = require('./login.hbs');

module.exports = BaseView.extend({
    events: {
        'submit form': 'onSubmit'
    },
    initialize: function() {
        this.context = {
            uuid: window.boot.uuid,
            name: window.boot.name
        };
        State.socket.on('fluzz:join', this.onJoin.bind(this));
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    onSubmit: function(evt) {
        evt.preventDefault();
        var name = evt.currentTarget[0].value;

        if (name.match(/^ *$/)) {
            this.context.errors = '"   " is not a name.';
            this.context.name = name;
            this.render();
        }

        else if (name.match(/^[\w ]*$/)) {
            State.socket.emit('fluzz:join', {name: name});
        }

        else {
            this.context.errors = 'Alphanumeric and spaces only, cheers.';
            this.context.name = name;
            this.render();
        }
    },
    onJoin: function(data) {
        if ('error' in data) {
            this.context.errors = 'Sorry, that name is taken.';
            this.context.name = data.name;
            this.render();
        }

        else {
            console.log('Join OK', data.name);
            State.playerName = data.name;
            $('#player-name').html(" - " + data.name);

            if (data.active) {
                State.router.navigate('quiz', {trigger: true});
            }

            else {
                State.router.navigate('wait', {trigger: true});
            }
        }
    }
});
