/**
 * @jsx React.DOM
 */

var React = require("react");
var Router = require("react-router");
var Link = Router.Link;
var JournalActions = require("../actions/JournalActions");
var JournalFormMixin = require("../mixins/JournalFormMixin");
var JournalStore = require("../stores/JournalStore");

var JournalNew = React.createClass({
  mixins: [JournalFormMixin, Router.Navigation],

  componentDidMount: function () {
    JournalStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    JournalStore.removeChangeListener(this._onChange);
  },
  getInitialState: function () {
    return {
      title: '',
      markdown_content: '',
      errors: null
    };
  },

  _onChange: function () {
    var errors = JournalStore.getErrors();
    if (errors === null) {
      this.transitionTo("/journal");
    }
    else {
      this.setState({
        title: this.state.title,
        markdown_content: this.state.markdown_content,
        errors: errors
      });
    }
  },

  render: function () {
    var messages = this.getErrorMessages(this.state);
    return (
      <div className="journal journal-new">
        <h1>New Journal Entry</h1>
        <div className="breadcrumb">
          <Link to="home">Home</Link>
          <Link to="journal">Journal</Link>
          <span>New</span>
        </div>
        <form action="/journal" method="post" onSubmit={this.saveEntry}>
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

  saveEntry: function (e) {
    e.preventDefault();
    JournalActions.createEntry(this.state);
  }
});

module.exports = JournalNew;