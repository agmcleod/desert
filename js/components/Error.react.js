/**
 * @jsx React.DOM
 */

var React = require("react");

var Error = React.createClass({
  render: function () {
    var message = this.props.message;
    if (message !== null && message !== "") {
      return (
        <p className="error">{message}</p>
      );
    }
    else {
      return "";
    }
  }
});

module.exports = Error;