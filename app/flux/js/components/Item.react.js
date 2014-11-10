/** @jsx React.DOM */
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Item = React.createClass({
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
  },

  getInitialState: function () {
    return {
      style: {
        top: 0,
        left: 0,
        position: 'relative'
      },
      dragging: false,
      rel: null // position relative to the cursor
    }
  },

  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) {
      return;
    }
    var pageOffset = $(this.getDOMNode()).offset();
    this.setState({
      dragging: true,
      originX: e.pageX,
      originY: e.pageY,
      elementX: pageOffset.left,
      elementY: pageOffset.top
    });
    e.stopPropagation()
    e.preventDefault()
  },
  onMouseUp: function (e) {
    this.setState({dragging: false})
    e.stopPropagation()
    e.preventDefault()
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
        top: this.state.elementY + deltaY + document.body.scrollTop
      }
    });
    e.stopPropagation()
    e.preventDefault()
  },

  propTypes: {
    item: ReactPropTypes.object.isRequired
  },
  render: function () {
    var item = this.props.item;
    var className = "item " + (this.state.dragging ? "dragging" : "");
    return (
      <li className={className} onMouseDown={this.onMouseDown} style={this.state.style}>{item.title}</li>
    );
  }
});

module.exports = Item;