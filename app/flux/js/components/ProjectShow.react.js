/** @jsx React.DOM */
var React = require('react');

var ProjectStore = require('../stores/ProjectStore');
var ProjectActions = require('../actions/ProjectActions');
var Project = require('./Project.react');
var Loading = require('./Loading.react');
var Item = require('./Item.react');

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
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this._onChange);
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
    this.setState(getProjectShowState(ProjectStore.getSetId(), ProjectStore.getItems(), this.state));
    $('.newItem').hide();
  },

  render: function () {
    if (this.state.project !== null) {
      var itemFormHref = "/projects/" + this.state.project.id + "/items"; 
      var newItemHref = "/projects/" + this.state.project.id + "/items/new";
      var todoItems = [];
      var progressItems = [];
      var completedItems = [];

      for (var i = 0; i < this.state.items.length; i++) {
        var item = this.state.items[i];
        if (item.state === "todo") {
          todoItems.push(<Item item={item} />);
        }
        else if (item.state === "inprogress") {
          progressItems.push(<Item item={item} />);
        }
        else if (item.state === "completed") {
          completedItems.push(<Item item={item} />);
        }
      }

      return (
        <div className="project project-show items">
          <h1>{this.state.project.title}</h1>
          <p>
            <a href={newItemHref} onClick={this.newItem}>New Item</a>
          </p>
          <div className="items">
            <ul className="items-menu">
              <li onClick={this.toggleTodo}>To Do</li>
              <li onClick={this.toggleProgress}>In Progress</li>
              <li onClick={this.toggleCompleted}>Completed</li>
            </ul>
            <div className="itemlists">
              <ul className="todoItems">{todoItems}</ul>
              <ul className="progressItems">{progressItems}</ul>
              <ul className="completedItems">{completedItems}</ul>
            </div>
          </div>
          <div className="newItem">
            <form action={itemFormHref} method="post" onSubmit={this.saveItem}>
              <div className="field">
                <label for="title">Title</label><br />
                <input type="text" id="title" onChange={this.handleChange("title")} />
              </div>

              <div className="field">
                <label for="description">Description</label><br />
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
    ProjectActions.createItem(this.state);
  },

  toggleCompleted: function () {

  },

  toggleProgress: function () {

  },

  toggleTodo: function () {

  }
});

module.exports = ProjectShow;