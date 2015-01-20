var ErrorHandler = {
  processErrors: function (fields, object) {
    var errors = {};
    for (var i = 0; i < fields.length; i++) {
      var field = fields[i];
      if (object[field] === null || typeof object[field] === 'undefined' || object[field] === "") {
        errors[field] = ['cannot be blank'];
      }
    }

    return errors;
  }
}

module.exports = ErrorHandler;