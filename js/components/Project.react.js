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
    var editAction = null;
    if (!project) {
      return null;
    }
    if (this.props.loggedIn) {
      editAction = (<Link to={"/projects/" + project.id + "/edit"} className="edit">Edit</Link>);
    }
    return (
      <div className="project">
        <h2><Link to={"/projects/" + project.id}>{project.title}</Link></h2>
        {editAction}
        <p>{project.description}</p>
      </div>
    );
  }
});

module.exports = Project;
