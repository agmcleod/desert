/**
 * @jsx React.DOM
 */

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Routes = Router.Routes;
var DefaultRoute = Router.DefaultRoute;
var Home = require("./components/Home.react");
var ProjectList = require("./components/ProjectList.react");
var Journal = require("./components/Journal.react");

var App = React.createClass({
  render: function () {
    return (
      <div id="main">
        <Home />
        <this.props.activeRouteHandler />
      </div>
    );
  }
});

var routes = (
  <Routes location="history">
    <Route name="app" path="/" handler={App}>
      <Route name="projects" handler={ProjectList} />
      <Route name="journal" handler={Journal} />
    </Route>
  </Routes>
);

React.renderComponent(routes, document.body);