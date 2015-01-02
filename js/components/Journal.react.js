/**
 * @jsx React.DOM
 */

var React = require("react");
var Link = require("react-router").Link;
var JournalStore = require("../stores/JournalStore");
var JournalActions = require("../actions/JournalActions.js");
var Loading = require("./Loading.react.js");
var Entry = require("./Entry.react.js");

function getJournalState (loading) {
  return {
    loading: loading,
    entries: JournalStore.getAll()
  };
}

var Journal = React.createClass({
  componentDidMount: function () {
    JournalActions.list();
    JournalStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    JournalStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return getJournalState(true);
  },

  _onChange: function () {
    this.setState(getJournalState(false));
  },

  render: function () {
    var entries = this.state.entries;
    var entryContainer;
    if (Object.keys(entries).length === 0 && this.state.loading) {
      entryContainer = (<Loading />);
    }
    else {
      entryContainer = [];
      for (var id in entries) {
        if (entries.hasOwnProperty(id)) {
          var entry = entries[id];
          entryContainer.push(<Entry entry={entry} key={id} />);
        }
      }
    }

    return (
      <div className="journal">
        <h1>Journal</h1>
        <div className="breadcrumb">
          <Link to="home">Home</Link>
          <span>Journal</span>
        </div>
        <Link to="journal/new">New Entry</Link>
        <div>{entryContainer}</div>
      </div>
    );
  }
});

module.exports = Journal;