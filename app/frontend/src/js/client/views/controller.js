'use strict';

var $ = require('jquery');
var BaseView = require('../../shared/views/base');
var State = require('../state');
var alert = require('../../shared/views/alert');

var tmpl = require('./controller.hbs');


var ControllerView = BaseView.extend({
    events: {
        'click .btn-buzz': 'onPress'
    },
    sockets: {
        'fluzz:question': 'onQuestion',
        'fluzz:answer': 'onAnswer',
        'fluzz:result': 'onResult',
        'fluzz:winner': 'onWin',
        'fluzz:end once': 'onEnd'
    },
    initialize: function() {
        this.context = {};
    },
    render: function() {
        this.$el.html(tmpl(this.context));
    },
    reset: function() {
        this.$el.find('.btn-buzz')
            .removeClass('btn-selected')
            .animate({opacity: 1})
            .removeAttr('disabled');
    },
    onPress: function(evt) {
        this.selected = $(evt.currentTarget).data('id');
        State.socket.emit('fluzz:answer', {selected: this.selected});
    },
    onQuestion: function() {
        this.reset();
    },
    onAnswer: function(data) {
        if (this.selected !== data.selected) {
            alert('danger', 'You already answered this question', 4000);
        }
        var $selected = this.$el.find('[data-id="' + data.selected + '"]');
        console.log($selected);
        this.$el.find('.btn-buzz').each(function(idx, elem) {
            var $elem = $(elem);
            $elem.attr('disabled', 'disabled');

            if (elem !== $selected[0]) {
                $elem.animate({opacity: 0.2});
            }

            else {
                $elem.addClass('btn-selected');
            }
        });
    },
    onResult: function(question) {
        if (this.selected === question.answer) {
            alert('success', 'You were right!', 4000);
        }

        else {
            alert('danger', 'You were wrong!', 4000);
        }
    },
    onWin: function() {
        State.router.navigate('/winner', {trigger: true});
    },
    onEnd: function() {
        State.router.navigate('/finish', {trigger: true});
    }
});

module.exports = ControllerView;
