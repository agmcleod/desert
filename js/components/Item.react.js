/** @jsx React.DOM */
var React = require('react');
var ReactPropTypes = React.PropTypes;
var ItemActions = require("../actions/ItemActions");
var ItemStore = require("../stores/ItemStore");

var Item = React.createClass({
  addEvents: function() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  },

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
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }

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

  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) {
      return;
    }
    e.stopPropagation();
    this.addEvents();
    var pageOffset;
    var el = $(this.getDOMNode());
    if (el.parents('.item-list-container').css('position') === 'absolute') {
      pageOffset = { left: 0, top: 0 };
    }
    else {
      pageOffset = el.offset();
    }
    this.setState({
      dragging: true,
      originX: e.pageX,
      originY: e.pageY,
      elementX: pageOffset.left,
      elementY: pageOffset.top,
      width: $(this.getDOMNode()).width()
    });
  },
  onMouseUp: function (e) {
    this.removeEvents();
    this.setState({dragging: false, style: this.getInitialState().style });
    var x = e.clientX + document.body.scrollLeft;
    var y = e.clientY + document.body.scrollTop;

    // TODO: Figure out a way without querying the DOM like this.
    var stateName;
    $('.item-list-container[id!="'+ this.props.state +'-items"], a.tab').each(function () {
      var rect = this.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        stateName = $(this).data('state-name');
      }
    });
    if (typeof stateName !== "string" || stateName === "") {
      throw "bad state name: " + stateName;
    }
    if (this.props.item.state !== stateName) {
      ItemActions.moveItem(this.props.item.id, stateName);
    }
  },
  onMouseMove: function (e) {
    if (!this.state.dragging) {
      return;
    }
    var deltaX = e.pageX - this.state.originX;
    var deltaY = e.pageY - this.state.originY;

    this.setState({
      style: {
        position: 'absolute',
        left: this.state.elementX + deltaX + document.body.scrollLeft,
        top: this.state.elementY + deltaY + document.body.scrollTop,
        width: this.state.width
      }
    });
  },

  openEditDialogue: function (e) {
    if (!this.state.dragging) {
      e.preventDefault();
      ItemActions.editItem(this.props.item.id);
    }
  },

  removeEvents: function() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  },

  removeItem: function (e) {
    e.preventDefault();
    ItemActions.removeItem(this.props.item.id);
  },

  render: function () {
    var item = this.props.item;
    var className = "item " + (this.state.dragging ? "dragging" : "");
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
      return (
        <li className={className} onClick={this.openEditDialogue} onMouseDown={this.onMouseDown} style={this.state.style}>
          <a href="#">{item.title}</a>
          <a href="#" className="close-btn" onClick={this.removeItem}>x</a>
        </li>
      );
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
        this.state.title = '';
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
        this.state.title = '';
      }
    }
  }
});

module.exports = Item;