var React = require('react');

var Logout = require('./logout.react.js');
var Contact = require('./Contact.react');

var TopLinks = React.createClass({
  render: function() {
    return (
      <div className='top-links'>
        <Contact />
        <Logout />
      </div>
    );
  }
});

module.exports = TopLinks;
