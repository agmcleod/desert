var AppDispatcher = require("../dispatchers/AppDispatcher");
var ItemConstants = require("../constants/ItemConstants");

var ItemActions = {
  createItem: function (data) {
    var postData = { item: { title: data.title, description: data.description, project_id: data.project.id } };
    $.post("/projects/" + data.project.id + "/items.json", postData).done(function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_CREATE,
        item: itemResData
      });
    });
  },

  moveItem: function (id, stateName) {
    AppDispatcher.handleViewAction({
      actionType: ItemConstants.MOVE_ITEM,
      stateName: stateName,
      id: id
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