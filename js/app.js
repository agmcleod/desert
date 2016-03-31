/**
 * @jsx React.DOM
 */

require('./assign');
var React = require('react');
var ReactRouter = require('react-router');
var render = require('react-dom').render;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Bro
var ProjectList = require("./components/ProjectList.react");
var ProjectEdit = require("./components/ProjectEdit.react");
var ProjectNew = require("./components/ProjectNew.react");
var ProjectShow = require("./components/ProjectShow.react");

render((
  <Router history={ReactRouter.browserHistory}>
    <Route path="/" component={ProjectList} />
    <Route path="projects" component={ProjectList} />
    <Route path="projects/new" component={ProjectNew} />
    <Route path="projects/:id/edit" component={ProjectEdit} />
    <Route path="projects/:id" component={ProjectShow} />
  </Router>
), document.getElementById('main'));
