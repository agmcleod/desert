var LocalStroageSync = require("../local_storage_sync");
var ErrorHandler = require("./ErrorHandler");

var projectSync = new LocalStroageSync("projects");
var itemSync = new LocalStroageSync("items");

var projectRequiredFields = ['title', 'description'];
var uuid = require("./uuid");

var ProjectDataSource = {
  createProject: function (dataFields, success, error) {
    $.post("/projects.json", { project: dataFields }).done(function (data) {
      projectSync.set(data);
      success(data);
    }).fail(function (jqXHR) {
      if (projectSync.isOffline(jqXHR)) {
        var errors = ErrorHandler.processErrors(projectRequiredFields, dataFields);
        if (Object.keys(errors).length === 0) {
          dataFields.uuid = uuid();
          dataFields.id = dataFields.uuid;
          success(dataFields);
        }
        else {
          error({ responseJSON : { errors: errors } });
        }
      }
      else {
        error(jqXHR);
      }
    });
  },

  getAll: function (success) {
    $.get("/projects.json").done(function (data) {
      projectSync.setAll(data);
      success(data);
    }).fail(function (jqXHR) {
      if (projectSync.isOffline(jqXHR)) {
        success(projectSync.getParsedData());
      }
    });
  },

  getProject: function (id, success) {
    $.when($.get('/projects/' + id + '.json'), $.get('/projects/' + id + '/items.json')).done(function (projectData, itemsData) {
      projectSync.set(projectData[0]);
      itemSync.mergeFrom(itemsData[0]);
      success(projectData, itemsData);
    }).fail(function (jqXHR) {
      if (projectSync.isOffline(jqXHR)) {
        success([projectSync.getById(id)], [itemSync.getParsedData()]);
      }
    });
  },

  updateProject: function (data, success, error) {
    var dataFields = { title: data.title, description: data.description };
    $.ajax({
      url: "/projects/" + data.id + ".json",
      data: { project: dataFields },
      type: "PUT"
    }).done(function (data) {
      projectSync.set(data);
      success(data);
    }).fail(function (jqXHR) {
      if (projectSync.isOffline(jqXHR)) {
        var errors = ErrorHandler.processErrors(projectRequiredFields, dataFields);
        if (Object.keys(errors).length === 0) {
          success(dataFields);
        }
        else {
          error({ responseJSON : { errors: errors } });
        }
      }
      else {
        error(jqXHR);
      }
    });
  }
};

module.exports = ProjectDataSource;