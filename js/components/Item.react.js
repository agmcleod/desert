/** @jsx React.DOM */
var React = require('react');
var ItemActions = require("../actions/ItemActions");
var ItemStore = require("../stores/ItemStore");
var ItemConstants = require("../constants/ItemConstants");

var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;

var findDOMNode = require('react-dom').findDOMNode;

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
    return this.props.connectDragSource(
      this.props.connectDropTarget(this.renderListItem())
    );
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

var itemSource = {
  beginDrag: function(props) {
    return {
      item: props.item
    };
  }
};

var cardTarget = {
  drop: function (props, monitor, component) {
    var item = monitor.getItem().item;
    var dragIndex = item.position;
    var hoverIndex = props.item.position;

    console.log(dragIndex, item.title, hoverIndex, props.item.title);

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    var hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    var clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    var hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    console.log(hoverClientY, hoverMiddleY);

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    var targetIndex = dragIndex;
    if (dragIndex < hoverIndex) {
      targetIndex += 1;
    } else if (dragIndex > hoverIndex) {
      targetIndex -= 1;
    }

    console.log('target: ' + targetIndex);

    // Time to actually perform the action
    ItemActions.moveItem(item.id, item.state, targetIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // monitor.getItem().index = hoverIndex;
  }
};

function dragCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function dropCollect(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

module.exports = DropTarget(ItemConstants.ITEM_TYPE, cardTarget, dropCollect)(DragSource(ItemConstants.ITEM_TYPE, itemSource, dragCollect)(Item));
