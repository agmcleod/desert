/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;
var ProjectNew = require('./ProjectNew.react');
var ProjectStore = require('../stores/ProjectStore');
var Project = require("./Project.react");
var ProjectActions = require("../actions/ProjectActions");
var Loading = require("./Loading.react.js");

function getProjectListState (loading) {
  return {
    loading: loading,
    projects: ProjectStore.getAll()
  };
}

var ProjectList = React.createClass({
  componentDidMount: function () {
    ProjectActions.list();
    ProjectStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    var projects = ProjectStore.getAll();
    if (Object.keys(projects).length === 0) {
      return {
        loading: true,
        projects: {}
      };
    }
    else {
      return {
        loading: false,
        projects: projects
      };
    }
  },

  _onChange: function () {
    this.setState(getProjectListState(false));
  },

  render: function () {
    var projects = this.state.projects;
    console.log(projects);
    var projectContainers;
    if (Object.keys(projects).length === 0 && this.state.loading) {
      projectContainers = (<Loading />);
    }
    else {
      projectContainers = [];
      for (var id in projects) {
        if (projects.hasOwnProperty(id)) {
          projectContainers.push(<Project project={projects[id]} key={id} />);
        }
      }
    }

    return (
      <div className="projects">
        <h1>Projects</h1>
        <div className="breadcrumb"><span>Projects</span></div>
        <p className="action-btn"><Link to="projects/new">Start New Project</Link></p>
        <div className="projectslist">{projectContainers}</div>
      </div>
    );
  }
});

module.exports = ProjectList;