/** @jsx React.DOM */
var React = require('react');
var ItemActions = require("../actions/ItemActions");
var ItemStore = require("../stores/ItemStore");
var ItemConstants = require("../constants/ItemConstants");

var DragSource = require('react-dnd').DragSource;

var Item = React.createClass({

  closeForm: function () {
    ItemActions.closeForm();
  },

  componentDidMount: function () {
    var item = this.props.item;
    if (item) {
      this.setState({
        title: item.title
      });
    }
    else {
      this.setState({project_id: this.props.projectId});
    }

  },

  // we could get away with not having this (and just having the listeners on
  // our div), but then the experience would be possibly be janky. If there's
  // anything w/ a higher z-index that gets in the way, then you're toast,
  // etc.
  componentDidUpdate: function (props, state) {
    // if (this.state.dragging && !state.dragging) {
    //   this.addEvents();
    // } else if (!this.state.dragging && state.dragging) {
    //   this.removeEvents();
    // }

    if (this.props.editing || this.props.newItem) {
      this.refs.textField.getDOMNode().focus();
    }
  },

  getInitialState: function() {
    return {
      title: null
    };
  },

  onChange: function (e) {
    var value = e.target.value;
    this.state.title = value;
    this.setState({title: value});
  },

  onClick: function (e) {
    e.preventDefault();
    ItemActions.editItem(this.props.item.id);
  },

  removeItem: function (e) {
    e.preventDefault();
    ItemActions.removeItem(this.props.item.id);
  },

  render: function () {
    return this.props.connectDragSource(this.renderListItem());
  },

  renderListItem: function () {
    var item = this.props.item;
    var className = "item";
    if (this.props.editing) {
      return (
        <li className={className}>
          <input ref="textField" type="text" value={this.state.title} onChange={this.onChange} onKeyUp={this.updateItem} />
        </li>
      );
    }
    else if(this.props.newItem) {
      return (
        <li className={className}>
          <input ref="textField" type="text" value={this.state.title} onChange={this.onChange} onKeyUp={this.saveItem} />
          <a href="#" className="close-btn" onClick={this.closeForm}>x</a>
        </li>
      );
    }
    else {
      if (this.props.loggedIn) {
        return (
          <li className={className} onClick={this.onClick} draggable="true" id={"item_" + this.props.item.id}>
            <span href="#">{this.state.title}</span>
            <span href="#" className="close-btn" onClick={this.removeItem}>x</span>
          </li>
        );
      }
      else {
        return (
          <li className={className} style={this.props.isDragging ? {opacity: 0.5} : {opacity: 1}} id={"item_" + this.props.item.id}>
            <a href="#">{this.state.title}</a>
          </li>
        );
      }
    }
  },

  saveItem: function (e) {
    if (e.keyCode === 27) {
      this.closeForm();
    }
    else if (e.keyCode === 13) {
      var value = this.state.title;
      if (value !== null && value.length > 0) {
        ItemActions.createItem(this.state);
        this.setState({title: null});
      }
    }
  },

  updateItem: function (e) {
    if (e.keyCode === 27) {
      this.closeForm();
    }
    else if (e.keyCode === 13) {
      var value = this.state.title;
      if (value !== null && value.length > 0) {
        ItemActions.updateItem({ title: value, id: ItemStore.getEditingItemId() });
      }
    }
  }
});

var boxSource = {
  beginDrag: function(props) {
    return {
      id: props.item.id
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

module.exports = DragSource(ItemConstants.ITEM_TYPE, boxSource, collect)(Item);
