var AppDispatcher = require("../dispatchers/AppDispatcher");
var ProjectConstants = require("../constants/ProjectConstants");

var ProjectActions = {
  createProject: function (data) {
    $.post("/projects.json", { project: data }).done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_CREATE,
        project: data
      });
    }).fail(function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_CREATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  },

  getProjectInformation: function (id) {
    $.when($.get('/projects/' + id + '.json'), $.get('/projects/' + id + '/items.json')).done(function (projectData, itemsData) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_SHOW,
        project: projectData[0],
        items: itemsData[0]
      });
    });
  },

  list: function () {
    $.get("/projects.json").done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_LIST,
        projects: data
      });
    });
  },

  updateProject: function (data) {
    $.ajax({
      url: "/projects/" + data.id + ".json",
      data: { project: { title: data.title, description: data.description } },
      type: "PUT"
    }).done(function (data) {
      data.updated = true;
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_UPDATE,
        project: data
      });
    }).fail(function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_UPDATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  }
};

module.exports = ProjectActions;