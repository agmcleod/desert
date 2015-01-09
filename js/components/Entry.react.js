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
        <h2>{entry.title}</h2>
        <div dangerouslySetInnerHTML={{__html: entry.content}} />
      </div>
    );
  }
});

module.exports = Entry;