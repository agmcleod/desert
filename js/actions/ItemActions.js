var AppDispatcher = require("../dispatchers/AppDispatcher");
var ItemConstants = require("../constants/ItemConstants");
var ItemDataSource = require("../data_sources/ItemDataSource");

var ItemActions = {
  closeForm: function () {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.CLOSE_FORM
    });
  },

  createItem: function (data) {
    ItemDataSource.createItem({ title: data.title, project_id: data.project_id }, function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_CREATE,
        item: itemResData
      });
    }, function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_CREATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  },

  editItem: function (id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_EDIT,
      id: id
    });
  },

  moveItem: function (id, stateName, position) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_MOVE,
      stateName: stateName,
      position: position,
      id: id
    });
  },

  newItem: function () {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_NEW
    });
  },

  removeItem: function (id) {
    ItemDataSource.removeItem(id, function () {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.DELETE_ITEM,
        id: id
      });
    });
  },

  setDragState: function (state) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_SET_STATE,
      state: state
    });
  },

  updateItem: function (item) {
    ItemDataSource.updateItem(item, function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_UPDATE,
        item: itemResData
      });
    }, function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_UPDATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  }
};

module.exports = ItemActions;
