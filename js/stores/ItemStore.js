var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ItemConstants = require("../constants/ItemConstants");
var ItemActions = require("../actions/ItemActions");
var LocalStorageSync = require("../local_storage_sync");

var itemSync = new LocalStorageSync('items');

var CHANGE_EVENT = 'change';

var _newItemState = false;
var _items = itemSync.getParsedData();
var _setItemId = null;
var _errors = null;

var ItemStore = Object.assign(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  getErrors: function () {
    return _errors;
  },

  getShowNewFormState: function () {
    return _newItemState;
  },

  getItem: function (id) {
    return _items[id];
  },

  getItems: function (project_id) {
    if (project_id) {
      var items = {};
      for (var id in _items) {
        if (_items.hasOwnProperty(id)) {
          var item = _items[id];
          if (item.project_id === project_id) {
            items[item.id] = item;
          }
        }
      }

      return items;
    }
    else {
      return _items;
    }
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

  removeItem: function (id) {
    delete _items[id];
  },

  setErrors: function (errors) {
    _errors = errors;
  },

  setShowNewFormState: function (state) {
    _newItemState = state;
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
      ItemStore.setShowNewFormState(false);
      ItemStore.setErrors(null);
      break;
    case ItemConstants.DELETE_ITEM:
      ItemStore.removeItem(action.id);
      break;
    case ItemConstants.ITEM_CREATE:
      ItemStore.setItem(action.item);
      ItemStore.setShowNewFormState(false);
      break;
    case ItemConstants.ITEM_CREATE_FAIL:
      ItemStore.setErrors(action.errors);
      break;
    case ItemConstants.ITEM_EDIT:
      ItemStore.setEditingItemId(action.id);
      break;
    case ItemConstants.ITEM_MOVE:
      ItemStore.moveItem(action.id, action.stateName);
      var item = ItemStore.getItem(action.id);
      ItemActions.updateItem(item);
      break;
    case ItemConstants.ITEM_NEW:
      ItemStore.setShowNewFormState(true);
      break;
    case ItemConstants.ITEM_UPDATE:
      ItemStore.setItem(action.item);
      ItemStore.setEditingItemId(null);
      break;
    case ItemConstants.ITEM_UPDATE_FAIL:
      ItemStore.setErrors(action.errors);
      break;
    default:
      return true;
  }
  ItemStore.emitChange();

  return true;
});

module.exports = ItemStore;