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
    ItemDataSource.createItem({ title: data.title, description: data.description, project_id: data.project.id }, function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_CREATE,
        item: itemResData
      });
    });
  },

  editItem: function (id) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_EDIT,
      id: id
    });
  },

  moveItem: function (id, stateName) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.ITEM_MOVE,
      stateName: stateName,
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

  updateItem: function (item) {
    ItemDataSource.updateItem(item, function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_UPDATE,
        item: itemResData
      });
    });
  }
};

module.exports = ItemActions;