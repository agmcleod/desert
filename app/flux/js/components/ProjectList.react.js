/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;
var ProjectNew = require('./ProjectNew.react');
var ProjectStore = require('../stores/ProjectStore');
var Project = require("./Project.react");
var ProjectActions = require("../actions/ProjectActions");

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
    return getProjectListState(false);
  },

  _onChange: function () {
    this.setState(getProjectListState(true));
  },

  render: function () {
    var projects = this.state.projects;
    var projectContainers;
    if (projects.length === 0 && this.state.loading) {
      projectContainers = (<Loading />);
    }
    else {
      projectContainers = [];
      for (var id in projects) {
        if (projects.hasOwnProperty(id)) {
          projectContainers.push(<Project project={projects[id]} />);
        }
      }
    }

    return (
      <div className="projects">
        <h1>Projects</h1>
        <Link to="projects/new">Start New Project</Link>
        <div>{projectContainers}</div>
      </div>
    );
  }
});

module.exports = ProjectList;