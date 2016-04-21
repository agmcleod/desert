/**
 * @jsx React.DOM
 */

var React = require("react");

var ErrorMessage = React.createClass({
  render: function () {
    var message = this.props.message;
    if (message && message !== "") {
      return (
        <p className="error">{message}</p>
      );
    }
    else {
      return <div />;
    }
  }
});

module.exports = ErrorMessage;