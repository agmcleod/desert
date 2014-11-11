/** @jsx React.DOM */
var React = require('react');

var ProjectStore = require('../stores/ProjectStore');
var ItemStore = require('../stores/ItemStore');
var ProjectActions = require('../actions/ProjectActions');
var ItemActions = require('../actions/ItemActions');
var Project = require('./Project.react');
var Loading = require('./Loading.react');
var ItemList = require('./ItemList.react');

function getProjectShowState (id, items, state)  {
  return {
    project: ProjectStore.findById(id),
    items: items,
    title: state.title,
    description: state.description
  };
}

var ProjectShow = React.createClass({
  componentDidMount: function () {
    var id = this.props.params.id;
    ProjectActions.getProjectInformation(id);
    ProjectStore.addChangeListener(this._onChange);
    ItemStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this._onChange);
    ItemStore.removeChangeListener(this._onChange);
  },

  eachItem: function (fn) {
    for (var id in this.state.items) {
      if (this.state.items.hasOwnProperty(id)) {
        var item = this.state.items[id];
        fn(item, id);
      }
    }
  },

  getInitialState: function () {
    return {
      title: "",
      description: "",
      project: null,
      items: []
    };
  },

  handleChange: function (key) {
    return function (e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  },

  newItem: function (e) {
    e.preventDefault();
    $('.newItem').show();
  },

  _onChange: function () {
    this.setState(getProjectShowState(ProjectStore.getSetId(), ItemStore.getItems(), this.state));
    $('.newItem').hide();
  },

  render: function () {
    if (this.state.project !== null) {
      var itemFormHref = "/projects/" + this.state.project.id + "/items"; 
      var newItemHref = "/projects/" + this.state.project.id + "/items/new";
      var todoItems = [];
      var progressItems = [];
      var completedItems = [];
      var _this = this;
      this.eachItem(function (item, id) {
        if (item.state === "todo") {
          todoItems.push(item);
        }
        else if (item.state === "inprogress") {
          progressItems.push(item);
        }
        else if (item.state === "completed") {
          completedItems.push(item);
        }
      });

      return (
        <div className="project project-show items">
          <h1>{this.state.project.title}</h1>
          <p>
            <a href={newItemHref} onClick={this.newItem}>New Item</a>
          </p>
          <div className="items">
            <div className="itemlists">
              <div className="todoItems itemListContainer" data-state-name="todo">
                <a className="todoTab" onClick={this.toggleTodo}>To Do</a>
                <ItemList items={todoItems} state="todo" />
              </div>
              <div className="inprogressItems itemListContainer" data-state-name="inprogress">
                <a className="inprogressTab" onClick={this.toggleProgress}>In Progress</a>
                <ItemList items={progressItems} state="inprogress" />
              </div>
              <div className="completedItems itemListContainer" data-state-name="completed">
                <a className="completedTab" onClick={this.toggleCompleted}>Completed</a>
                <ItemList items={completedItems} state="completed" />
              </div>
            </div>
          </div>
          <div className="newItem">
            <form action={itemFormHref} method="post" onSubmit={this.saveItem}>
              <div className="field">
                <label htmlFor="title">Title</label><br />
                <input type="text" id="title" onChange={this.handleChange("title")} />
              </div>

              <div className="field">
                <label htmlFor="description">Description</label><br />
                <textarea id="description" rows="4" onChange={this.handleChange("description")} />
              </div>

              <div className="field field-submit">
                <input type="submit" />
              </div>
            </form>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="project project-show items">
          <Loading />
        </div>
      );
    }
  },

  saveItem: function (e) {
    e.preventDefault();
    ItemActions.createItem(this.state);
  },

  toggleCompleted: function () {

  },

  toggleProgress: function () {

  },

  toggleTodo: function () {

  }
});

module.exports = ProjectShow;