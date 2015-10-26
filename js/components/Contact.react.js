/**
 * @jsx React.DOM
 */

var React = require('react');

var Contact = React.createClass({
  render: function () {
    return (<a className='contact' href='mailto:aaron.g.mcleod@gmail.com?subject=Desert Trail Support'>Contact</a>);
  }
});

module.exports = Contact;
