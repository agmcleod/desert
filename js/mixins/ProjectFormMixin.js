var ProjectFormMixin = {
  getErrorMessages: function (state) {
    var messages = {};
    var errors = state.errors;
    if (errors) {
      if (errors.title) {
        messages['title'] = errors.title.join(', ');
      }

      if (errors.description) {
        messages['description'] = errors.description.join(', ');
      }

      if (errors.access) {
        messages['access'] = errors.access.join(', ');
      }
    }

    return messages;
  }
};

module.exports = ProjectFormMixin;