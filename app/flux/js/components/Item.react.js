/** @jsx React.DOM */
var React = require('react');
var ReactPropTypes = React.PropTypes;

var Item = React.createClass({
  propTypes: {
    project: ReactPropTypes.object.isRequired
  },
  render: function () {
    var item = this.props.item;
    return (
      <li className="item">{item.title}</li>
    );
  }
});

module.exports = Item;