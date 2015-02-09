var AppDispatcher = require("../dispatchers/AppDispatcher");
var ProjectConstants = require("../constants/ProjectConstants");
var ProjectDataSource = require("../data_sources/ProjectDataSource");
var AppConstants = require("../constants/AppConstants");

var ProjectActions = {
  createProject: function (data) {
    ProjectDataSource.createProject(data, function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_CREATE,
        project: data
      });
    }, function (jqXHR) {
      if (jqXHR.status === 403) {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ACCESS_DENIED
        });
      }
      else {
        AppDispatcher.handleViewAction({
          actionType: ProjectConstants.PROJECT_CREATE_FAIL,
          errors: jqXHR.responseJSON.errors
        });
      }
    });
  },

  getProjectInformation: function (id) {
    ProjectDataSource.getProject(id, function (projectData, itemsData) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_SHOW,
        project: projectData[0],
        items: itemsData[0]
      });
    });
  },

  list: function () {
    ProjectDataSource.getAll(function (data) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_LIST,
        projects: data
      });
    });
  },

  updateProject: function (data) {
    ProjectDataSource.updateProject(data, function (data) {
      data.updated = true;
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_UPDATE,
        project: data
      });
    }, function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: ProjectConstants.PROJECT_UPDATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  }
};

module.exports = ProjectActions;