/** @jsx React.DOM */
var React = require('react');
var ReactPropTypes = React.PropTypes;
var Link = require('react-router').Link;

var Project = React.createClass({
  propTypes: {
    project: ReactPropTypes.object.isRequired
  },

  render: function () {
    var project = this.props.project;
    return (
      <div className="project">
        <h2><Link to="projectshow" params={project}>{project.title}</Link></h2>
        <p>{project.description}</p>
      </div>
    );
  }
});

module.exports = Project;