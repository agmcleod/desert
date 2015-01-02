/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;

var Entry = React.createClass({
  render: function() {
    var entry = this.props.entry;
    return (
      <div className="entry">
        <h3>{entry.title}</h3>
        <div>{entry.content}</div>
      </div>
    );
  }
});

module.exports = Entry;