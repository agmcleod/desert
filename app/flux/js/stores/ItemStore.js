var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ItemConstants = require("../constants/ItemConstants");
var merge = require("react/lib/merge");

var CHANGE_EVENT = 'change';

var ItemStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ItemConstants.ITEM_CREATE:
      
      break;
  }
});

module.exports = ItemStore;