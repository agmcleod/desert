/**
 * @jsx React.DOM
 */

var React = require("react");
var Item = require('./Item.react');
var ItemStore = require('../stores/ItemStore');
var DropTarget = require('react-dnd').DropTarget;
var ItemConstants = require("../constants/ItemConstants");

var ItemList = React.createClass({
  render: function () {
    var items = this.props.items;
    var itemList = [];
    var editingId = ItemStore.getEditingItemId();
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      itemList.push(<Item item={item} loggedIn={this.props.loggedIn} editing={editingId === item.id} key={item.id} />);
    }

    var form = null;
    if (this.props.newItem) {
      form = <Item projectId={this.props.projectId} newItem={true} />
    }

    return this.props.connectDropTarget(
      <ul className={this.props.stateName + ' item-list'}>
        {itemList}
        {form}
      </ul>
    );
  }
});

var target = {
  drop: function(props, monitor) {
    props.onDrop(monitor.getItem().item);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

module.exports = DropTarget([ItemConstants.ITEM_TYPE], target, collect)(ItemList);
