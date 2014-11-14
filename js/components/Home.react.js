/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;

var Home = React.createClass({
  render: function () {
    return (
      <div className="home">
        <div className="projects">
          <h1>
            <Link to="projects">Projects</Link>
          </h1>
        </div>
        <div className="journal">
          <h1>
            <Link to="journal">Journal</Link>
          </h1>
        </div>
      </div>
    );
  }
});

module.exports = Home;