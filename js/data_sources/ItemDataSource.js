var LocalStorageSync = require("../local_storage_sync");
var ErrorHandler = require("./ErrorHandler");
var itemSync = new LocalStorageSync("items");
var itemRequiredFields = ['title'];
var uuid = require("./uuid");

var ItemDataSource = {
  createItem: function (dataFields, success, error) {
    $.post("/projects/" + dataFields.project_id + "/items.json", { item: dataFields }).done(function (data) {
      itemSync.set(data);
      success(data);
    }).fail(function (jqXHR) {
      if (itemSync.isOffline(jqXHR)) {
        var errors = ErrorHandler.processErrors(itemRequiredFields, dataFields);
      }
      else {
        error(jqXHR);
      }
    });
  },

  removeItem: function (id, success) {
    $.ajax({ url: "/items/" + id + ".json", type: "DELETE" }).done(function () {
      itemSync.removeObject(id);
      success();
    });
  },

  updateItem: function (item, success, error) {
    $.ajax({ url: "/items/" + item.id + ".json", data: { item: item }, type: "PUT" }).done(function (data) {
      itemSync.mergeFrom(data);
      success(data);
    }).fail(error);
  }
};

module.exports = ItemDataSource;
