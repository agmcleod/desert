/**
 * @jsx React.DOM
 */

var React = require("react");
var Item = require('./Item.react');

var ItemList = React.createClass({
  classes: function () {
    return [this.props.state, this.state.hover ? "hover" : ""].join(' ');
  },

  getInitialState: function () {
    return {
      hover: false
    };
  },

  onMouseEnter: function () {
    this.setState({ hover: true });
  },

  onMouseLeave: function () {
    this.setState({ hover: false });
  },

  render: function () {
    var items = this.props.items;
    var itemList = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemList.push(<Item item={item} key={item.id} />);
    };

    return (
      <ul className={this.classes()} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>{itemList}</ul>
    );
  }
});

module.exports = ItemList;