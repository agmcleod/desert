var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ItemConstants = require("../constants/ItemConstants");
var ItemActions = require("../actions/ItemActions");
var merge = require("react/lib/merge");

var CHANGE_EVENT = 'change';

var _items = {};
var _setItemId = null;

var ItemStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getItem: function (id) {
    return _items[id];
  },

  getItems: function () {
    return _items;
  },

  getSetItemId: function () {
    return _setItemId;
  },

  moveItem: function (id, stateName) {
    _items[id].state = stateName;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  setItem: function (item) {
    _items[item.id] = item;
    _setItemId = item.id;
  },

  setItems: function (items) {
    _items = items;
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action;
  var emit = false;
  switch (action.actionType) {
    case ItemConstants.ITEM_CREATE:
      ItemStore.setItem(action.item);
      emit = true;
      break;
    case ItemConstants.ITEM_UPDATE:
      ItemStore.setItem(action.item);
      emit = true;
      break;
    case ItemConstants.MOVE_ITEM:
      ItemStore.moveItem(action.id, action.stateName);
      emit = true;
      // TODO: Try to refactor this. Not sure if calling actions from a store is right.
      ItemActions.updateItem(ItemStore.getItem(action.id));
      break;
    default:
      return true;
  }
  if (emit) {
    ItemStore.emitChange();
  }

  return true;
});

module.exports = ItemStore;