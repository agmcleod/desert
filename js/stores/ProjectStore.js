var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ProjectConstants = require("../constants/ProjectConstants");
var AppConstants = require("../constants/AppConstants");

var Router = require('react-router');
var ItemStore = require("./ItemStore");
var LocalStorageSync = require("../local_storage_sync");

var projectSync = new LocalStorageSync("projects");
var _errors = null;
var _projects = projectSync.getParsedData();
var _setId = null;

var CHANGE_EVENT = 'change';

var ProjectStore = Object.assign(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  appendProject: function (project) {
    _projects[project.id] = project;
    _setId = project.id;
    _errors = null;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  findById: function (id) {
    var project = null;
    if (_projects[id]) {
      project = _projects[id];
    }
    return _projects[id];
  },

  getAll: function () {
    return _projects;
  },

  getErrors: function () {
    return _errors;
  },

  getSetId: function () {
    return _setId;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  setErrors: function (errors) {
    _errors = errors;
  },

  setProjects: function (projects) {
    for (var key in projects) {
      if (projects.hasOwnProperty(key)) {
        _projects[parseInt(key)] = projects[key];
      }
    }
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {
    case AppConstants.ACCESS_DENIED:
      ProjectStore.setErrors({ 'access': ['You must login to do that.'] });
      break;
    case ProjectConstants.PROJECT_CREATE:
      ProjectStore.appendProject(action.project);
      break;

    case ProjectConstants.PROJECT_CREATE_FAIL:
      ProjectStore.setErrors(action.errors);
      break;

    case ProjectConstants.PROJECT_LIST:
      ProjectStore.setProjects(action.projects);
      break;

    case ProjectConstants.PROJECT_SHOW:
      ProjectStore.appendProject(action.project);
      ItemStore.setItems(action.items);
      break;

    case ProjectConstants.PROJECT_DESTROY:

      break;

    case ProjectConstants.PROJECT_DESTROY_COMPLETED:

      break;

    case ProjectConstants.PROJECT_UPDATE:
      ProjectStore.appendProject(action.project);
      break;
    case ProjectConstants.PROJECT_UPDATE_FAIL:
      ProjectStore.setErrors(action.errors);
      break;

    default:
      return true;
  }

  ProjectStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = ProjectStore;