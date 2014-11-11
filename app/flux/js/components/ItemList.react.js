/**
 * @jsx React.DOM
 */

var React = require("react");
var Item = require('./Item.react');

var ItemList = React.createClass({
  onMouseUp: function () {
    console.log(this.props.state);
  },

  render: function () {
    var items = this.props.items;
    var itemList = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemList.push(<Item item={item} key={item.id} parentObject={this} />);
    };
    return (
      <ul onMouseUp={this.onMouseUp}>{itemList}</ul>
    );
  }
});

module.exports = ItemList;