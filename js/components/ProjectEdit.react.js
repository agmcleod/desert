var React = require("react");

var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var Loading = require("./Loading.react");
var Router = require("react-router");
var Link = Router.Link;
var ProjectFormMixin = require("../mixins/ProjectFormMixin");

function getProjectEditState (id, errors) {
  var project = ProjectStore.findById(id);
  return {
    id: project._id,
    title: project.title,
    description: project.description,
    errors: errors,
    updated: project.updated
  };
}

var ProjectEdit = React.createClass({
  mixins: [ProjectFormMixin, Router.Navigation, Router.State],
  componentDidMount: function () {
    ProjectStore.addChangeListener(this._onChange);
    var id = this.getParams()._id;
    ProjectActions.getProjectInformation(id);
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      title: '',
      description: '',
      errors: null
    }
  },

  handleChange: function (key) {
    return function (e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  },

  _onChange: function () {
    var errors = ProjectStore.getErrors();
    this.setState(getProjectEditState(ProjectStore.getSetId(), errors));
    if (errors === null && this.state.updated) {
      this.transitionTo("/projects");
    }
  },

  render: function () {
    var messages = this.getErrorMessages(this.state);
    return (
      <div className="projects projects-new">
        <h1>Edit Project</h1>
        <div className="breadcrumb">
          <Link to="app">Home</Link>
          <Link to="projects">Projects</Link>
          <span>Edit</span>
        </div>
        <form action="/projects" method="post" onSubmit={this.updateProject}>
          <Error message={messages['access']} />
          <div className="field text-field">
            <label htmlFor="title">Title</label>
            <input className="textField" type="text" name="title" id="title" onChange={this.handleChange("title")} value={this.state.title} />
            <Error message={messages['title']} />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={this.state.description} rows="4" onChange={this.handleChange("description")} />
            <Error message={messages['description']} />
          </div>
          <div className="field field-submit">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  },

  updateProject: function (e) {
    e.preventDefault();
    ProjectActions.updateProject(this.state);
  }
});

module.exports = ProjectEdit;