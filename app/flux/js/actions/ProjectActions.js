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

  list: function () {
    $.get("/projects.json").done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_LIST,
        projects: data
      });
    });
  }
};

module.exports = ProjectActions;