/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;
var ProjectNew = require('./ProjectNew.react');
var ProjectStore = require('../stores/ProjectStore');
var Project = require("./Project.react");
var ProjectActions = require("../actions/ProjectActions");
var SessionActions = require("../actions/SessionActions");
var SessionStore = require("../stores/SessionStore");
var Loading = require("./Loading.react.js");
var Spinner = require('./spinner.react');
var TopLinks = require('./TopLinks.react');

function getProjectListState (loading) {
  return {
    loading: loading,
    loggedIn: SessionStore.getLoggedInStatus(),
    projects: ProjectStore.getAll()
  };
}

var ProjectList = React.createClass({
  componentDidMount: function () {
    ProjectActions.list();
    ProjectStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onSessionChange);
    SessionActions.verifySession();
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this._onChange);
    SessionStore.removeChangeListener(this._onSessionChange);
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

  _onSessionChange: function () {
    this.setState({ loggedIn: SessionStore.getLoggedInStatus() });
  },

  render: function () {
    var projects = this.state.projects;
    var projectContainers;
    if (Object.keys(projects).length === 0 && this.state.loading) {
      projectContainers = (<Loading />);
    }
    else {
      projectContainers = [];
      for (var id in projects) {
        if (projects.hasOwnProperty(id)) {
          projectContainers.push(<Project project={projects[id]} loggedIn={this.state.loggedIn} key={id} />);
        }
      }
    }
    var projectActionButton = null;
    if (this.state.loggedIn) {
      projectActionButton = (<p className="action-btn"><Link to="projects/new">Start New Project</Link></p>);
    }
    return (
      <div className="projects">
        <h1>Projects</h1>
        <TopLinks />
        <div className="breadcrumb"><span>Projects</span></div>
        {projectActionButton}
        {this.state.loading ? <Loading /> : null}
        <div className="projectslist">{projectContainers}</div>
      </div>
    );
  }
});

module.exports = ProjectList;
