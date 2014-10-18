/**
 * @jsx React.DOM
 */

var React = require('react');
var Error = require('./Error.react');
var ProjectActions = require('../actions/ProjectActions');
var ProjectStore = require('../stores/ProjectStore');
var Router = require("react-router");

var ProjectNew = React.createClass({
  mixins: [Router.Navigation],
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
      this.transitionTo("/projects");
    }
    else {
      ProjectStore.setErrors(null);
      this.setState({ title: this.state.title, description: this.state.description, errors: errors });
    }
  },

  render: function () {
    var messages = {};
    if (this.state.errors !== null) {
      var errors = this.state.errors;
      if (errors.title) {
        messages['title'] = errors.title.join(', ');
      }

      if (errors.description) {
        messages['description'] = errors.description.join(', ');
      }

      if (errors.markdown_content) {
        messages['markdown_content'] = errors.markdown_content.join(', ');
      }
    }
    return (
      <div className="projects projects-new">
        <h1>New Project</h1>
        <form action="/projects" method="post" onSubmit={this.saveProject}>
          <div className="field">
            <label for="title">Title</label>
            <br />
            <input type="text" name="title" id="title" onChange={this.handleChange("title")} value={this.state.title} />
            <Error message={messages['title']} />
          </div>
          <div className="field">
            <label for="description">Description</label><br />
            <textarea id="description" value={this.state.description} onChange={this.handleChange("description")} />
            <Error message={messages['description']} />
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