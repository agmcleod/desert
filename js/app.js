/**
 * @jsx React.DOM
 */

var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var ProjectList = require("./components/ProjectList.react");
var ProjectEdit = require("./components/ProjectEdit.react");
var ProjectNew = require("./components/ProjectNew.react");
var ProjectShow = require("./components/ProjectShow.react");

var App = React.createClass({
  render: function () {
    return (
      <div id="main">
        <RouteHandler />
      </div>
    );
  }
});

var routes = (
  <Route name="app" path="/" handler={App}>
    <Route name="projects" handler={ProjectList} />
    <Route name="projects/new" handler={ProjectNew} />
    <Route name="projectedit" path="/projects/:id/edit" handler={ProjectEdit} />
    <Route name="projectshow" path="/projects/:id" handler={ProjectShow} />
    <DefaultRoute handler={ProjectList} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, document.body);
});