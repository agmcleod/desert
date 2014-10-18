var AppDispatcher = require("../dispatchers/AppDispatcher");
var ItemConstants = require("../constants/ItemConstants");

var ItemActions = {
  createItem: function (data) {
    var postData = { item: { title: data.title, description: data.description, project_id: data.project.id } };
    $.post("/projects/" + data.project.id + "/items", postData).done(function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ItemConstants.ITEM_CREATE,
        item: itemResData
      });
    });
  }
};

module.exports = ItemActions;