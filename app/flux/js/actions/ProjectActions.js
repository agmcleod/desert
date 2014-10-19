var AppDispatcher = require("../dispatchers/AppDispatcher");
var ProjectConstants = require("../constants/ProjectConstants");

var ProjectActions = {
  createItem: function (data) {
    var postData = { item: { title: data.title, description: data.description, project_id: data.project.id } };
    $.post("/projects/" + data.project.id + "/items.json", postData).done(function (itemResData) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.ITEM_CREATE,
        item: itemResData
      });
    });
  },

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

  list: function () {
    $.get("/projects.json").done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_LIST,
        projects: data
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
  }
};

module.exports = ProjectActions;