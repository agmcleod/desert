/**
 * @jsx React.DOM
 */

var React = require("react");
var Logout = React.createClass({
  render: function () {
    return (
      <a href='/logout' className='logout'>Logout</a>
    );
  }
});

module.exports = Logout;
