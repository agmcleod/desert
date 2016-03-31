/** @jsx React.DOM */
var React = require('react');

var ProjectStore = require('../stores/ProjectStore');
var ItemStore = require('../stores/ItemStore');
var ProjectActions = require('../actions/ProjectActions');
var ItemActions = require('../actions/ItemActions');
var Project = require('./Project.react');
var Loading = require('./Loading.react');
var ItemList = require('./ItemList.react');

var SessionActions = require("../actions/SessionActions");
var SessionStore = require("../stores/SessionStore");
var Spinner = require('./spinner.react');

var TopLinks = require('./TopLinks.react');

var Router = require("react-router");
var Link = Router.Link;

var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');

function getProjectShowState (id, items)  {
  return {
    project: ProjectStore.findById(id),
    items: items,
    renderItemForm: ItemStore.getShowNewFormState()
  };
}

function itemSort (a, b) {
  if (a.position < b.position) {
    return -1;
  }
  else if (a.position > b.position) {
    return 1;
  }
  else {
    return 0;
  }
}

var ProjectShow = React.createClass({
  mixins: [ Router.State ],
  componentDidMount: function () {
    var id = this.props.params.id;
    ProjectActions.getProjectInformation(id);
    ProjectStore.addChangeListener(this.onChange);
    ItemStore.addChangeListener(this.onChange);
    SessionStore.addChangeListener(this.onSessionChange);
    SessionActions.verifySession();
    this.screenWidth = window.innerWidth;
    if (window.innerWidth > 600) {
      $('body').removeClass('mobile-mode');
    }
    else if (window.innerWidth <= 600) {
      $('body').addClass('mobile-mode');
    }
    window.addEventListener('resize', this.resizeHandler);
  },

  componentDidUpdate: function () {
    if (!$('body').hasClass('mobile-mode')) {
      return;
    }
    this.setListsToHeight();
  },

  componentWillUnmount: function () {
    ProjectStore.removeChangeListener(this.onChange);
    ItemStore.removeChangeListener(this.onChange);
    SessionStore.removeChangeListener(this.onSessionChange);

    window.removeEventListener('resize', this.resizeHandler);
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
    var project = ProjectStore.findById(this.props.params.id);
    if (project) {
      var items = ItemStore.getItems(project.id);
      return {
        project: project,
        items: items,
        editItem: false,
        focusTodo: true,
        loading: true,
        renderItemForm: false,
        loggedIn: SessionStore.getLoggedInStatus()
      };
    }
    else {
      return {
        project: null,
        items: [],
        editItem: null,
        loading: true,
        focusTodo: true,
        renderItemForm: false,
        loggedIn: SessionStore.getLoggedInStatus()
      };
    }
  },

  newItem: function (e) {
    e.preventDefault();
    ItemActions.newItem();
  },

  onChange: function () {
    this.setState(
      Object.assign(getProjectShowState(ProjectStore.getSetId(), ItemStore.getItems()), {loading: false})
    );
  },

  onItemDrop: function (stateName, item) {
    if (item.state !== stateName) {
      ItemActions.moveItem(item.id, stateName, 0);
    }
  },

  onSessionChange: function () {
    this.setState({ loggedIn: SessionStore.getLoggedInStatus() });
  },

  render: function () {
    if (this.state.project !== null) {
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

      todoItems.sort(itemSort);
      progressItems.sort(itemSort);
      completedItems.sort(itemSort);

      var newItemAction = null;
      if (this.state.loggedIn) {
        newItemAction = (<p className="action-btn">
          <a href={newItemHref} onClick={this.newItem}>New Item</a>
        </p>);
      }

      var spinner = null;
      if (this.state.loading) {
        spinner = <Spinner />;
      }

      return (
        <div className="projects project-show items">
          <h1>{this.state.project.title}</h1>
          <TopLinks />
          <div className="breadcrumb">
            <Link to="/projects">Projects</Link>
            <span>{this.state.project.title}</span>
          </div>
          {spinner}
          {newItemAction}
          <div className="items">
            <div className="tabs">
              <a className={"todo-tab tab" + (this.state.focusTodo ? ' focused' : '')} data-state-name="todo" onClick={this.toggleTodo}>To Do</a>
              <a className={"inprogress-tab tab" + (this.state.focusInprogress ? ' focused' : '')} data-state-name="inprogress" onClick={this.toggleProgress}>In Progress</a>
              <a className={"completed-tab tab" + (this.state.focusCompleted ? ' focused' : '')} data-state-name="completed" onClick={this.toggleCompleted}>Completed</a>
            </div>
            <div className="itemlists">
              <div className={"todo-items item-list-container" + (this.state.focusTodo ? ' highz' : '')} data-state-name="todo">
                <ItemList projectId={this.state.project.id} onDrop={this.onItemDrop.bind(this, 'todo')} items={todoItems} newItem={this.state.renderItemForm} stateName="todo" loggedIn={this.state.loggedIn} />
              </div>
              <div className={"inprogress-items item-list-container" + (this.state.focusInprogress ? ' highz' : '')} data-state-name="inprogress">
                <ItemList projectId={this.state.project.id} onDrop={this.onItemDrop.bind(this, 'inprogress')} items={progressItems} stateName="inprogress" loggedIn={this.state.loggedIn} />
              </div>
              <div className={"completed-items item-list-container" + (this.state.focusCompleted ? ' highz' : '')} data-state-name="completed">
                <ItemList projectId={this.state.project.id} onDrop={this.onItemDrop.bind(this, 'completed')} items={completedItems} stateName="completed" loggedIn={this.state.loggedIn} />
              </div>
              {this.state.renderItemForm || ItemStore.getEditingItemId() ? <p className='instructions'>Press esc to cancel, or enter to save.</p> : null}
            </div>
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

  resizeHandler: function () {
    if (window.innerWidth > 600 && this.screenWidth <= 600) {
      $('body').removeClass('mobile-mode');
      $('.itemlists div').css('height', 'auto');
    }
    else if (window.innerWidth <= 600 && this.screenWidth > 600) {
      $('body').addClass('mobile-mode');
      this.setListsToHeight();
    }
    this.screenWidth = window.innerWidth;
  },

  setListsToHeight: function () {
    var maxheight = 0;
    $('.itemlists div').css('height', 'auto');
    $('.itemlists div').each(function () {
      maxheight = Math.max(maxheight, $(this).height());
    });

    $('.itemlists div').css('height', maxheight + 'px');
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
  }
});

module.exports = DragDropContext(HTML5Backend)(ProjectShow);
