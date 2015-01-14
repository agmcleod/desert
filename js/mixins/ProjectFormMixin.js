var ProjectFormMixin = {
  getErrorMessages: function (state) {
    var messages = {};
    if (state.errors !== null) {
      var errors = state.errors;
      if (errors.title) {
        messages['title'] = errors.title.join(', ');
      }

      if (errors.description) {
        messages['description'] = errors.description.join(', ');
      }
    }

    return messages;
  }
};

module.exports = ProjectFormMixin;