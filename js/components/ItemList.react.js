/**
 * @jsx React.DOM
 */

var React = require("react");
var Item = require('./Item.react');
var ItemStore = require('../stores/ItemStore');

var ItemList = React.createClass({
  render: function () {
    var items = this.props.items;
    var itemList = [];
    var editingId = ItemStore.getEditingItemId();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemList.push(<Item item={item} loggedIn={this.props.loggedIn} editing={editingId === item._id} key={item._id} />);
    }

    var form = null;
    if (this.props.newItem) {
      form = <Item projectId={this.props.projectId} newItem={true} />
    }

    return (
      <ul className={this.props.stateName}>
        {itemList}
        {form}
      </ul>
    );
  }
});

module.exports = ItemList;