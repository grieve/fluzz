'use strict';

var $ = require('jquery');
var BaseView = require('./base');
var State = require('../state');

var tmpl = require('./controller.hbs');


var ControllerView = BaseView.extend({
    events: {
        'click .btn-buzz': 'onPress'
    },
    initialize: function() {
        this.context = {};
        State.socket.on('fluzz:question', this.onQuestion.bind(this));
        State.socket.on('fluzz:answer', this.onAnswer.bind(this));
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
        var selected = $(evt.currentTarget).data('id');
        State.socket.emit('fluzz:answer', {selected: selected});
    },
    onQuestion: function() {
        this.reset();
    },
    onAnswer: function(data) {
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
    }
});

module.exports = ControllerView;