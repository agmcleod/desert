var LocalStroageSync = require("../local_storage_sync");


var projectSync = new LocalStroageSync("projects");
var itemSync = new LocalStroageSync("items");

var ProjectDataSource = {
  createProject: function (dataFields, success, error) {
    $.post("/projects.json", { project: dataFields }).done(function (data) {
      projectSync.set(data);
      success(data);
    }).fail(error);
  },

  getAll: function (success) {
    $.get("/projects.json").done(function (data) {
      projectSync.setAll(data);
      success(data);
    });
  },

  getProject: function (id, success) {
    $.when($.get('/projects/' + id + '.json'), $.get('/projects/' + id + '/items.json')).done(function (projectData, itemsData) {
      projectSync.set(projectData);
      itemSync.mergeFrom(itemsData);
      success(projectData, itemsData);
    });
  },

  updateProject: function (data, success, error) {
    $.ajax({
      url: "/projects/" + data.id + ".json",
      data: { project: { title: data.title, description: data.description } },
      type: "PUT"
    }).done(function (data) {
      projectSync.set(projectData);
      success(data);
    }).fail(error);
  }
};

module.exports = ProjectDataSource;