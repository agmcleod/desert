var AppDispatcher = require("../dispatchers/AppDispatcher");
var EventEmitter = require("events").EventEmitter;
var ProjectConstants = require("../constants/ProjectConstants");
var merge = require("react/lib/merge");
var Router = require('react-router');

var _errors = null;
var _projects = [];
var _items = [];
var _setId = null;
var _setItemId = null;

var CHANGE_EVENT = 'change';

var ProjectStore = merge(EventEmitter.prototype, {
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  appendItem: function (item) {
    var hasItem = false;
    for (var i = 0; i < _items.length; i++) {
      var it = _items[i];
      if (typeof item.id === "number" && it.id === item.id) {
        hasItem = true;
        break;
      }
    }
    if (!hasItem) {
      _items.push(item);
    }
    _setItemId = item.id;
  },

  appendProject: function (project) {
    var hasProject = false;
    for (var i = 0; i < _projects.length; i++) {
      var p = _projects[i];
      if (typeof project.id === "number" && p.id === project.id) {
        hasProject = true;
        break;
      }
    }
    if (!hasProject) {
      _projects.push(project);
    }
    _setId = project.id;
  },

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  findById: function (id) {
    var project = null;
    for (var i = 0; i < _projects.length; i++) {
      if (_projects[i].id === id) {
        project = _projects[i];
      }
    }
    return project;
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

  getSetItemId: function () {
    return _setItemId;
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  setErrors: function (err) {
    _errors = errors;
  },

  setItems: function (items) {
    _items = items;
  },

  setProjects: function (projects) {
    _projects = projects;
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ProjectConstants.ITEM_CREATE:
      ProjectStore.appendItem(action.item);
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
      ProjectStore.setItems(action.items);
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

  // This often goes in each case that should trigger a UI change. This store
  // needs to trigger a UI change after every view action, so we can make the
  // code less repetitive by putting it here.  We need the default case,
  // however, to make sure this only gets called after one of the cases above.
  ProjectStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = ProjectStore;