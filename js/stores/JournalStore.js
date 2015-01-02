var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var JournalEntryConstants = require("../constants/JournalEntryConstants.js");
var merge = require("react/lib/merge");
var Router = require('react-router');

var _entries = {};
var _errors = null;

var CHANGE_EVENT = 'change';

var JournalStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getAll: function () {
    return _entries;
  },

  getErrors: function () {
    return _errors;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  setEntries: function (entries) {
    _entries = entries;
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {
    case JournalEntryConstants.JOURNAL_LIST:
      JournalStore.setEntries(action.entries);
      break;

    default:
      return true;
  }
  JournalStore.emitChange();

  return true;
});

module.exports = JournalStore;