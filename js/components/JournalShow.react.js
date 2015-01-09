/** @jsx React.DOM */
var React = require('react');
var Entry = require('./Entry.react.js');
var JournalActions = require('../actions/JournalActions.js');
var JournalStore = require('../stores/JournalStore.js');
var Loading = require('./Loading.react.js');
var Link = require('react-router').Link;

function getJournalShowState (id) {
  return {
    entry: JournalStore.findById(id)
  };
}

var JournalShow = React.createClass({
  componentDidMount: function () {
    var id = this.props.params.id;
    JournalActions.getEntryInformation(id);
    JournalStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    JournalStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      entry: null
    };
  },

  _onChange: function () {
    this.setState(getJournalShowState(JournalStore.getSetId()));
  },

  render: function () {
    var content;
    if (this.state.entry) {
      content = <Entry entry={this.state.entry} />;
    }
    else {
      content = <Loading />;
    }
    return (
      <div className="journal">
        <h1>Journal</h1>
        <div className="breadcrumb">
          <Link to="home">Home</Link>
          <Link to="journal">Journal</Link>
        </div>
        {content}
      </div>
    );
  }
});

module.exports = JournalShow;