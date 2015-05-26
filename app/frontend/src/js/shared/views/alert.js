'use strict';

var $ = require('jquery');
var Bb = require('backbone');

var Alert = Bb.View.extend({
    tagName: 'div',
    className: 'alert floating-alert',
    initialize: function(opts) {
        this.style = opts.style || 'info';
        this.content = opts.content || 'Alert!';
    },
    render: function() {
        this.$el.addClass('alert-' + this.style);
        this.$el.html(this.content);
    }
});

module.exports = function(style, content, timeout) {
    var alert = new Alert({style: style, content: content});
    alert.render();
    $('body').append(alert.el);
    setTimeout(function() {
        alert.$el.remove();
    }, timeout || 2000);
};
