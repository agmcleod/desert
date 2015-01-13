var JournalFormMixin = {
  getErrorMessages: function (state) {
    var messages = {};
    if (state.errors !== null) {
      var errors = state.errors;
      if (errors.title) {
        messages['title'] = errors.title.join(', ');
      }

      if (errors.markdown_content) {
        messages['markdown_content'] = errors.markdown_content.join(', ');
      }
    }

    return messages;
  },

  handleChange: function (key) {
    return function (e) {
      var state = {};
      state[key] = e.target.value;
      this.setState(state);
    }.bind(this);
  }
};

module.exports = JournalFormMixin;