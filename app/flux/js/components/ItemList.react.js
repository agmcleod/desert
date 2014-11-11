/**
 * @jsx React.DOM
 */

var React = require("react");
var Item = require('./Item.react');

var ItemList = React.createClass({
  render: function () {
    var items = this.props.items;
    var itemList = [];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemList.push(<Item item={item} key={item.id} />);
    };

    return (
      <ul className={this.props.state}>{itemList}</ul>
    );
  }
});

module.exports = ItemList;