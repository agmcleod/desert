var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var JournalEntryConstants = require("../constants/JournalEntryConstants.js");
var merge = require("react/lib/merge");
var Router = require('react-router');

var _entries = {};
var _errors = null;
var _setId = null;

var CHANGE_EVENT = 'change';

var JournalStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  appendEntry: function (entry) {
    _entries[entry.id] = entry;
    _setId = entry.id;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  findById: function (id) {
    return _entries[id];
  },

  getAll: function () {
    return _entries;
  },

  getErrors: function () {
    return _errors;
  },

  getSetId: function () {
    return _setId;
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
    case JournalEntryConstants.ENTRY_CREATE:
      JournalStore.appendEntry(action.entry);
      break;
    case JournalEntryConstants.ENTRY_CREATE_FAIL:
      JournalStore.setErrors(action.errors);
      break;
    case JournalEntryConstants.ENTRY_SHOW:
      JournalStore.appendEntry(action.entry);
      break;
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