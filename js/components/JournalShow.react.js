/** @jsx React.DOM */
var React = require('react');
var Entry = require('./Entry.react.js');
var JournalActions = require('../actions/JournalActions.js');
var JournalStore = require('../stores/JournalStore.js');
var Loading = require('./Loading.react.js');
var Router = require("react-router");
var Link = Router.Link;

function getJournalShowState (id) {
  return {
    entry: JournalStore.findById(id)
  };
}

var JournalShow = React.createClass({
  mixins: [ Router.State ],
  componentDidMount: function () {
    var id = this.getParams().id;
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
    var content, entryTitle, editLink;
    if (this.state.entry) {
      content = <Entry entry={this.state.entry} />;
      entryTitle = this.state.entry.title;
      editLink = <p className="action-btn"><Link to="journaledit" params={{id: this.state.entry.id}}>Edit</Link></p>;
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
          <span>{entryTitle}</span>
        </div>
        {editLink}
        {content}
      </div>
    );
  }
});

module.exports = JournalShow;