var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ItemConstants = require("../constants/ItemConstants");
var ItemActions = require("../actions/ItemActions");
var merge = require("react/lib/merge");

var CHANGE_EVENT = 'change';

var _showFormState = false;
var _items = {};
var _setItemId = null;

var ItemStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getShowFormState: function () {
    return _showFormState;
  },

  getItem: function (id) {
    return _items[id];
  },

  getItems: function () {
    return _items;
  },

  getEditingItemId: function () {
    return _setItemId;
  },

  moveItem: function (id, stateName) {
    _items[id].state = stateName;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  setShowFormState: function (state) {
    _showFormState = state;
  },

  setEditingItemId: function (id) {
    _setItemId = id;
  },

  setItem: function (item) {
    _items[item.id] = item;
  },

  setItems: function (items) {
    _items = items;
  }
});

AppDispatcher.register(function (payload) {
  var action = payload.action;
  switch (action.actionType) {
    case ItemConstants.CLOSE_FORM:
      ItemStore.setEditingItemId(null);
      ItemStore.setShowFormState(false);
      break;
    case ItemConstants.ITEM_CREATE:
      ItemStore.setItem(action.item);
      ItemStore.setShowFormState(false);
      break;
    case ItemConstants.ITEM_EDIT:
      ItemStore.setShowFormState(true);
      ItemStore.setEditingItemId(action.id);
      break;
    case ItemConstants.ITEM_MOVE:
      ItemStore.moveItem(action.id, action.stateName);
      var item = ItemStore.getItem(action.id);
      ItemActions.updateItem(item);
      break;
    case ItemConstants.ITEM_NEW:
      ItemStore.setShowFormState(true);
      ItemStore.setEditingItemId(null);
      break;
    case ItemConstants.ITEM_UPDATE:
      ItemStore.setItem(action.item);
      ItemStore.setEditingItemId(null);
      ItemStore.setShowFormState(false);
      break;
    default:
      return true;
  }
  ItemStore.emitChange();

  return true;
});

module.exports = ItemStore;