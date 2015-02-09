var AppDispatcher = require("../dispatchers/AppDispatcher");
var SessionConstants = require("../constants/SessionConstants");
var EventEmitter = require("events").EventEmitter;

var _loggedIn = false;

var CHANGE_EVENT = 'change';

var SessionStore = Object.assign(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getLoggedInStatus: function () {
    return _loggedIn;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action;
  if (action.actionType === SessionConstants.LOGGED_IN) {
    _loggedIn = action.loggedIn;
    SessionStore.emitChange();
  }

  return true;
});

module.exports = SessionStore;