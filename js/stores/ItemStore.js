var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ItemConstants = require("../constants/ItemConstants");
var AppConstants = require("../constants/AppConstants");
var ItemActions = require("../actions/ItemActions");
var LocalStorageSync = require("../local_storage_sync");

var itemSync = new LocalStorageSync('items');

var CHANGE_EVENT = 'change';

var _newItemState = false;
var _items = itemSync.getParsedData();
var _setItemId = null;
var _errors = null;

function collectionNotForId (id, collection) {
  var coll = [];
  for (var i = collection.length - 1; i >= 0; i--) {
    var it = collection[i];
    if (it._id !== id) {
      coll.push(it);
    }
  }

  return coll;
}

function itemSort (a, b) {
  if (a.position < b.position) {
    return -1;
  }
  else if (a.position > b.position) {
    return 1;
  }
  else {
    return 0;
  }
}

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
            items[item._id] = item;
          }
        }
      }

      return items;
    }
    else {
      return _items;
    }
  },

  getItemsByState: function (stateName) {
    var items = [];
    for (var id in _items) {
      if (_items.hasOwnProperty(id)) {
        var item = _items[id];
        if (item.state === stateName) {
          items.push(item);
        }
      }
    }

    return items;
  },

  getEditingItemId: function () {
    return _setItemId;
  },

  moveItem: function (id, stateName, position) {
    var item = _items[id];

    var temp = this.getItemsByState(item.state);
    // get items for the state
    var itemsForState = collectionNotForId(item._id, temp);

    itemsForState.sort(itemSort);
    // reset their position without the one being moved
    for (var i = 0; i < itemsForState.length; i++) {
      var it = itemsForState[i];
      it.position = i + 1;
    }

    item.state = stateName;
    item.position = position;

    temp = this.getItemsByState(item.state);
    itemsForState = collectionNotForId(item._id, temp);

    var index = 1;
    for (var i = 0; i < itemsForState.length; i++) {
      var it = itemsForState[i];
      if (it.position >= item.position) {
        it.position = item.position + index;
        index++;
      }
    }
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
    _items[item._id] = item;
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
      ItemStore.removeItem(action._id);
      break;
    case ItemConstants.ITEM_CREATE:
      ItemStore.setItem(action.item);
      break;
    case ItemConstants.ITEM_CREATE_FAIL:
      ItemStore.setErrors(action.errors);
      break;
    case ItemConstants.ITEM_EDIT:
      ItemStore.setEditingItemId(action._id);
      break;
    case ItemConstants.ITEM_MOVE:
      ItemStore.moveItem(action._id, action.stateName, action.position);
      var item = ItemStore.getItem(action._id);
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