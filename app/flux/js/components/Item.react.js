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

  getDefaultProps: function () {
    return {
      // allow the initial position to be passed in as a prop
      initialPos: {x: 0, y: 0}
    }
  },

  getInitialState: function () {
    return {
      pos: this.props.initialPos,
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
    var pos = $(this.getDOMNode()).offset()
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
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
    if (!this.state.dragging) return
    this.setState({
      pos: {
        x: e.pageX - this.state.rel.x,
        y: e.pageY - this.state.rel.y
      }
    })
    e.stopPropagation()
    e.preventDefault()
  },

  propTypes: {
    item: ReactPropTypes.object.isRequired
  },
  render: function () {
    var item = this.props.item;
    return (
      <li className="item" onMouseDown={this.onMouseDown}>{item.title}</li>
    );
  }
});

module.exports = Item;