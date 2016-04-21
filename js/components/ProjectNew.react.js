/**
 * @jsx React.DOM
 */

var React = require('react');
var ErrorMessage = require('./Error.react');
var ProjectActions = require('../actions/ProjectActions');
var ProjectStore = require('../stores/ProjectStore');
var ProjectFormMixin = require("../mixins/ProjectFormMixin");
var Router = require("react-router");
var Link = Router.Link;

var ProjectNew = React.createClass({
  mixins: [ProjectFormMixin],
  componentDidMount: function () {
    ProjectStore.addChangeListener(this._onChange);
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
    if (errors === null) {
      Router.browserHistory.push("/projects");
    }
    else {
      this.setState({ title: this.state.title, description: this.state.description, errors: errors });
    }
  },

  render: function () {
    var messages = this.getErrorMessages(this.state);
    return (
      <div className="projects projects-new">
        <h1>New Project</h1>
        <div className="breadcrumb">
          <Link to="/projects">Projects</Link>
          <span>New Project</span>
        </div>
        <form action="/projects" method="post" onSubmit={this.saveProject}>
          <ErrorMessage message={messages['access']} />
          <div className="field text-field">
            <label htmlFor="title">Title</label>
            <input className="textField" type="text" name="title" id="title" onChange={this.handleChange("title")} value={this.state.title} />
            <ErrorMessage message={messages['title']} />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" value={this.state.description} rows="4" onChange={this.handleChange("description")} />
            <ErrorMessage message={messages['description']} />
          </div>
          <div className="field field-submit">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  },

  saveProject: function (e) {
    e.preventDefault();
    ProjectActions.createProject(this.state);
  }
});

module.exports = ProjectNew;
