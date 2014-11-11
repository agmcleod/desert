var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ProjectConstants = require("../constants/ProjectConstants");
var merge = require("react/lib/merge");
var Router = require('react-router');
var ItemStore = require("./ItemStore");

var _errors = null;
var _projects = {};
var _setId = null;

var CHANGE_EVENT = 'change';

var ProjectStore = merge(EventEmitter.prototype, {
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

  getItems: function () {
    return _items;
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

  setItems: function (items) {
    for (var key in items) {
      if (items.hasOwnProperty(key)) {
        _items[parseInt(key)] = items[key];
      }
    }
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
  var emit = false;
  switch(action.actionType) {
    case ProjectConstants.PROJECT_CREATE:
      ProjectStore.appendProject(action.project);
      emit = true;
      break;

    case ProjectConstants.PROJECT_CREATE_FAIL:
      ProjectStore.setErrors(action.errors);
      emit = true;
      break;

    case ProjectConstants.PROJECT_LIST:
      ProjectStore.setProjects(action.projects);
      emit = true;
      break;

    case ProjectConstants.PROJECT_SHOW:
      ProjectStore.appendProject(action.project);
      ItemStore.setItems(action.items);
      emit = true;
      break;

    case ProjectConstants.PROJECT_DESTROY:
      
      break;

    case ProjectConstants.PROJECT_DESTROY_COMPLETED:
      
      break;

    case ProjectConstants.PROJECT_UPDATE:
      
      break;

    default:
      return true;
  }

  if (emit) {
    ProjectStore.emitChange();
  }

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = ProjectStore;