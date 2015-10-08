/** @jsx React.DOM */
var React = require('react');
var ReactPropTypes = React.PropTypes;
var ItemActions = require("../actions/ItemActions");
var ItemStore = require("../stores/ItemStore");

function intersectRect(r1, r2) {
  return !(r2.left > r1.right ||
           r2.right < r1.left ||
           r2.top > r1.bottom ||
           r2.bottom < r1.top);
}

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

  getInitialState: function () {
    return {
      style: {
        top: 0,
        left: 0,
        position: 'static'
      },
      dragging: false
    }
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

  // calculate relative position to the mouse and set dragging=true
  onDragStart: function (e) {
    // only left mouse button
    if (e.button !== 0) {
      return;
    }
    var pageOffset;
    var el = $(this.getDOMNode());
    if (el.parents('.item-list-container').css('position') === 'absolute') {
      pageOffset = { left: 0, top: 0 };
    }
    else {
      pageOffset = el.offset();
    }
    this.setState({
      elementX: pageOffset.left,
      elementY: pageOffset.top,
      width: $(this.getDOMNode()).width()
    });
  },

  onDragEnd: function (e) {
    var x = e.clientX + document.body.scrollLeft;
    var y = e.clientY + document.body.scrollTop;

    // TODO: Figure out a way without querying the DOM like this.
    var position = 1;

    var node = this.getDOMNode();
    var stateName = null;

    var _this = this;

    $('.item-list-container').each(function () {
      var rect = this.getBoundingClientRect();
      var offset = $(this).offset();
      rect.top += offset.top;
      rect.bottom += offset.top;
      rect.left += offset.left;
      rect.right += offset.left;
      var dragRect = {top: y, left: x, right: x + rect.width, bottom: y + rect.height};
      if (intersectRect(rect, dragRect) && this.dataset.stateName !== _this.props.item.state) {
        stateName = this.dataset.stateName;
      }
      // if to re-order
      if ($(this).find('li').length > 0) {
        var positions = $(this).find('li[id!="'+ node.id +'"]').map(function () {
          return $(this).offset().top;
        });
        for (var i = 0; i < positions.length; i++) {
          if (y < positions[i]) {
            break;
          }
          position = i + 1;
        }
      }
    });

    if (!stateName) {
      stateName = ItemStore.getDraggingItemState();
    }

    this.setState({style: this.getInitialState().style });
    ItemActions.moveItem(this.props.item.id, stateName, position);
  },

  removeItem: function (e) {
    e.preventDefault();
    ItemActions.removeItem(this.props.item.id);
  },

  render: function () {
    var item = this.props.item;
    var className = "item";
    if (this.props.editing) {
      return (
        <li className={className} style={this.state.style}>
          <input ref="textField" type="text" value={this.state.title} onChange={this.onChange} onKeyUp={this.updateItem} />
        </li>
      );
    }
    else if(this.props.newItem) {
      return (
        <li className={className} style={this.state.style}>
          <input ref="textField" type="text" value={this.state.title} onChange={this.onChange} onKeyUp={this.saveItem} />
          <a href="#" className="close-btn" onClick={this.closeForm}>x</a>
        </li>
      );
    }
    else {
      if (this.props.loggedIn) {
        return (
          <li className={className} onClick={this.onClick} draggable="true" onDragStart={this.onDragStart} onDragEnd={this.onDragEnd} style={this.state.style} id={"item_" + this.props.item.id}>
            <span href="#">{this.state.title}</span>
            <span href="#" className="close-btn" onClick={this.removeItem}>x</span>
          </li>
        );
      }
      else {
        return (
          <li className={className} style={this.state.style} id={"item_" + this.props.item.id}>
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

module.exports = Item;
