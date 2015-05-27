'use strict';

var _ = require('underscore');
var Bb = require('backbone');

var delegateSocketSplitter = /^(\S+)\s*(once)?$/;

Bb.View = (function(View) {
    return View.extend({
        constructor: function(options) {
            this.socket = options.socket;
            View.apply(this, arguments);
        }
    });
})(Bb.View);

var SocketView = Bb.View.extend({
    sockets: {
    },
    delegateEvents: function(events) {
        Bb.View.prototype.delegateEvents.call(this, events);

        return this.delegateSockets();
    },
    delegateSockets: function(sockets) {
        if (!(sockets || (sockets = _.result(this, 'sockets')))) {
            return this;
        }
        this.undelegateSockets();
        this._boundSockets = {};

        for (var key in sockets) {
            var method = sockets[key];

            if (!_.isFunction(method)) {
                method = this[sockets[key]];
            }

            if (!method) {
                continue;
            }
            var match = key.match(delegateSocketSplitter);
            method = _.bind(method, this);
            this._boundSockets[match[1]] = method;
            this.delegateSocket(match[1], match[2], method);
        }

        return this;
    },
    undelegateSockets: function() {
        if (this._boundSockets === undefined) {
            return this;
        }

        for (var key in this._boundSockets) {
            this.undelegateSocket(key, this._boundSockets[key]);
        }
        this._boundSockets = {};

        return this;
    },
    delegateSocket: function(event, once, listener) {
        if (once === undefined) {
            console.log('Socket ON:', event, this);
            this.socket.on(event, listener);
        }

        else {
            console.log('Socket ONCE:', event, this);
            this.socket.once(event, listener);
        }
    },
    undelegateSocket: function(event, listener) {
        console.log('Socket OFF:', event, this);
        this.socket.removeListener(event, listener);
    },
    remove: function() {
        this.stopListening();
        this.undelegateSockets();

        return this;
    }
});


var BaseView = SocketView.extend({
    el: 'main'
});

module.exports = BaseView;
