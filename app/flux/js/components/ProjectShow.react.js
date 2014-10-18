/** @jsx React.DOM */
var React = require('react');

var ProjectStore = require('../stores/ProjectStore');
var Project = require ('./Project.react');

var ProjectShow = React.createClass({
  componentDidMount: function () {
  },

  render: function () {
    return (
      <div className="project-show items">
      </div>
    );
  }
});

module.exports = ProjectShow;