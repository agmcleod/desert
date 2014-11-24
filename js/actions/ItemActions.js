var AppDispatcher = require("../dispatchers/AppDispatcher");
var ItemConstants = require("../constants/ItemConstants");

var ItemActions = {
  closeForm: function () {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.CLOSE_FORM
    });
  },

  createItem: function (data) {
    var postData = { item: { title: data.title, description: data.description, project_id: data.project.id } };
    $.post("/projects/" + data.project.id + "/items.json", postData).done(function (itemResData) {
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
    $.ajax({ url: "/items/" + id + ".json", type: "DELETE" }).done(function () {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.DELETE_ITEM,
        id: id
      });
    });
  },

  updateItem: function (item) {
    $.ajax({ url: "/items/" + item.id + ".json", data: { item: item }, type: "PUT" }).done(function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.UPDATE_ITEM,
        item: itemResData
      });
    });
  }
};

module.exports = ItemActions;