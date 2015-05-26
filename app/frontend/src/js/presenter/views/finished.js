'use strict';

var State = require('../state');
var BaseView = require('../../shared/views/base');
var tmpl = require('./finished.hbs');

var FinishedView = BaseView.extend({
    initialize: function() {
    },
    render: function() {
        this.$el.html(tmpl());
    }
});

module.exports = FinishedView;
