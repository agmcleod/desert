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
  var title, description;
  var item = state.items[ItemStore.getEditingItemId()];
  var object = state;
  if (item !== null && typeof item !== "undefined") {
    object = item;
  }
  title = object.title;
  description = object.description;
  return {
    project: ProjectStore.findById(id),
    items: items,
    title: title,
    description: description,
    renderItemForm: ItemStore.getShowFormState()
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
      description: null,
      project: null,
      items: [],
      editItem: null
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
    ItemActions.newItem();
    this.setState({
      title: "",
      description: ""
    });
  },

  _onChange: function () {
    this.setState(getProjectShowState(ProjectStore.getSetId(), ItemStore.getItems(), this.state));
  },

  render: function () {
    if (this.state.project !== null) {
      var handler, formTitle;
      if (ItemStore.getEditingItemId() === null) {
        handler = this.saveItem;
        formTitle = "New Item";
      }
      else {
        handler = this.updateItem;
        formTitle = "Editing Item";
      }
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

      var form = null;
      if (this.state.renderItemForm) {
        var style = { left: $('.todo-items').offset().left + "px" };
        form = (
          <div className="new-item" style={style}>
            <a className="close-btn"><img src="/images/close.png" alt="Close" /></a>
            <form onSubmit={handler}>
              <h3>{formTitle}</h3>
              <div className="field text-field">
                <input type="text" id="title" onChange={this.handleChange("title")} placeholder="Title" value={this.state.title} />
              </div>

              <div className="field">
                <textarea id="description" rows="4" onChange={this.handleChange("description")} value={this.state.description} />
              </div>

              <div className="field field-submit">
                <input type="submit" />
              </div>
            </form>
          </div>
        );
      }

      return (
        <div className="project project-show items">
          <h1>{this.state.project.title}</h1>
          <p>
            <a href={newItemHref} onClick={this.newItem}>New Item</a>
          </p>
          <div className="items">
            <div className="itemlists">
              <div className="todo-items item-list-container" data-state-name="todo">
                <a className="todo-tab tab" onClick={this.toggleTodo}>To Do</a>
                <ItemList items={todoItems} state="todo" />
              </div>
              <div className="inprogress-items item-list-container" data-state-name="inprogress">
                <a className="inprogress-tab tab" onClick={this.toggleProgress}>In Progress</a>
                <ItemList items={progressItems} state="inprogress" />
              </div>
              <div className="completed-items item-list-container" data-state-name="completed">
                <a className="completed-tab tab" onClick={this.toggleCompleted}>Completed</a>
                <ItemList items={completedItems} state="completed" />
              </div>
            </div>
          </div>
          {form}
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

  },

  updateItem: function (e) {
    e.preventDefault();
    ItemActions.updateItem({ title: this.state.title, description: this.state.description, id: ItemStore.getEditingItemId() });
  }
});

module.exports = ProjectShow;