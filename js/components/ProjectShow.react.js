/** @jsx React.DOM */
var React = require('react');

var ProjectStore = require('../stores/ProjectStore');
var ItemStore = require('../stores/ItemStore');
var ProjectActions = require('../actions/ProjectActions');
var ItemActions = require('../actions/ItemActions');
var Project = require('./Project.react');
var Loading = require('./Loading.react');
var ItemList = require('./ItemList.react');
var Error = require('./Error.react');
var Router = require("react-router");
var Link = Router.Link;

function getProjectShowState (id, items, state, errors)  {
  var title, description;
  var item = state.items[ItemStore.getEditingItemId()];
  var object = state;
  if (item !== null && typeof item !== "undefined" && errors === null) {
    object = item;
  }
  title = object.title;
  description = object.description;
  return {
    project: ProjectStore.findById(id),
    items: items,
    title: title,
    description: description,
    renderItemForm: ItemStore.getShowFormState(),
    errors: errors
  };
}

var ProjectShow = React.createClass({
  mixins: [ Router.State ],
  closeForm: function () {
    ItemActions.closeForm();
  },
  componentDidMount: function () {
    var id = this.getParams().id;
    ProjectActions.getProjectInformation(id);
    ProjectStore.addChangeListener(this._onChange);
    ItemStore.addChangeListener(this._onChange);
  },

  componentDidUpdate: function () {
    var maxheight = 0;
    $('.itemlists div').each(function () {
      maxheight = Math.max(maxheight, $(this).height());
    });

    $('.itemlists div').css('height', maxheight + 'px');
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

  getErrorMessages: function () {
    var messages = {};
    if (this.state.errors !== null) {
      var errors = this.state.errors;
      if (errors.title) {
        messages['title'] = errors.title.join(', ');
      }
    }

    return messages;
  },

  getInitialState: function () {
    var project = ProjectStore.findById(this.getParams().id);
    if (project) {
      var items = ItemStore.getItems(project.id);
      return {
        title: project.title,
        description: project.description,
        project: project,
        items: items,
        editItem: false,
        focusTodo: true,
        errors: null
      };
    }
    else {
      return {
        title: "",
        description: null,
        project: null,
        items: [],
        editItem: null,
        focusTodo: true,
        errors: null
      };
    }
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
    var errors = ItemStore.getErrors();
    this.setState(getProjectShowState(ProjectStore.getSetId(), ItemStore.getItems(), this.state, errors));
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
        var messages = this.getErrorMessages();
        var style = { left: $('.todo-items').offset().left + "px" };
        form = (
          <div className="new-item" style={style}>
            <a className="close-btn" onClick={this.closeForm}><img src="/images/close.png" alt="Close" /></a>
            <form onSubmit={handler}>
              <h3>{formTitle}</h3>
              <div className="field text-field">
                <input type="text" id="title" onChange={this.handleChange("title")} placeholder="Title (required)" value={this.state.title} />
                <Error message={messages['title']} />
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
        <div className="projects project-show items">
          <h1>{this.state.project.title}</h1>
          <div className="breadcrumb">
            <Link to="projects">Projects</Link>
            <span>{this.state.project.title}</span>
          </div>
          <p className="action-btn">
            <a href={newItemHref} onClick={this.newItem}>New Item</a>
          </p>
          <div className="items">
            <div className="tabs">
              <a className={"todo-tab tab" + (this.state.focusTodo ? ' focused' : '')} data-state-name="todo" onClick={this.toggleTodo}>To Do</a>
              <a className={"inprogress-tab tab" + (this.state.focusInprogress ? ' focused' : '')} data-state-name="inprogress" onClick={this.toggleProgress}>In Progress</a>
              <a className={"completed-tab tab" + (this.state.focusCompleted ? ' focused' : '')} data-state-name="inprogress" onClick={this.toggleCompleted}>Completed</a>
            </div>
            <div className="itemlists">
              <div className={"todo-items item-list-container" + (this.state.focusTodo ? ' highz' : '')} data-state-name="todo">
                <ItemList items={todoItems} state="todo" />
              </div>
              <div className={"inprogress-items item-list-container" + (this.state.focusInprogress ? ' highz' : '')} data-state-name="inprogress">
                <ItemList items={progressItems} state="inprogress" />
              </div>
              <div className={"completed-items item-list-container" + (this.state.focusCompleted ? ' highz' : '')} data-state-name="completed">
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
    this.setState({
      focusTodo: false,
      focusInprogress: false,
      focusCompleted: true
    });
  },

  toggleProgress: function () {
    this.setState({
      focusTodo: false,
      focusInprogress: true,
      focusCompleted: false
    });
  },

  toggleTodo: function () {
    this.setState({
      focusTodo: true,
      focusInprogress: false,
      focusCompleted: false
    });
  },

  updateItem: function (e) {
    e.preventDefault();
    ItemActions.updateItem({ title: this.state.title, description: this.state.description, id: ItemStore.getEditingItemId() });
  }
});

module.exports = ProjectShow;