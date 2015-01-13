var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var JournalActions = require("../actions/JournalActions");
var Loading = require('./Loading.react.js');
var JournalFormMixin = require("../mixins/JournalFormMixin");
var JournalStore = require("../stores/JournalStore");

function getJournalEditState (id, errors) {
  var entry = JournalStore.findById(id);
  return {
    id: entry.id,
    title: entry.title,
    markdown_content: entry.markdown_content,
    updated: entry.updated,
    errors: errors
  };
}

var JournalEdit = React.createClass({
  mixins: [JournalFormMixin, Router.Navigation],
  componentDidMount: function () {
    JournalStore.addChangeListener(this._onChange);
    var id = this.props.params.id;
    JournalActions.getEntryInformation(id);
  },

  componentWillUnmount: function () {
    JournalStore.removeChangeListener(this._onChange);
  },

  getInitialState: function () {
    return {
      entry: null,
      errors: null
    };
  },

  _onChange: function () {
    var errors = JournalStore.getErrors();
    this.setState(getJournalEditState(JournalStore.getSetId(), errors));
    if (errors === null && this.state.updated) {
      this.transitionTo("/journal");
    }
  },

  render: function () {
    var messages = this.getErrorMessages(this.state);
    return (
      <div className="journal journal-edit">
        <h1>Edit Journal Entry</h1>
        <div className="breadcrumb">
          <Link to="home">Home</Link>
          <Link to="journal">Journal</Link>
          <span>Edit</span>
        </div>
        <form action="/journal" method="post" onSubmit={this.updateEntry}>
          <div className="field text-field">
            <label for="title">Title</label>
            <input className="textField" type="text" name="title" onChange={this.handleChange.call(this, "title")} value={this.state.title} />
            <Error message={messages['title']} />
          </div>
          <div className="field">
            <label for="markdown_content">Content</label>
            <textarea id="markdown_content" value={this.state.markdown_content} rows="4" onChange={this.handleChange.call(this, "markdown_content")} />
            <Error message={messages['markdown_content']} />
          </div>
          <div className="field field-submit">
            <input type="submit" />
          </div>
        </form>
      </div>
    );
  },

  updateEntry: function (e) {
    e.preventDefault();
    JournalActions.updateEntry(this.state);
  }
});

module.exports = JournalEdit;