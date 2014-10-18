/**
 * @jsx React.DOM
 */

var React = require('react');

var Loading = React.createClass({
  render: function () {
    return (
      <p className="Loading">Loading&hellip;</p>
    );
  }
});

module.exports = Loading;