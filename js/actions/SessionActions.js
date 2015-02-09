var AppDispatcher = require("../dispatchers/AppDispatcher");
var SessionConstants = require("../constants/SessionConstants");

var SessionActions = {
  verifySession: function () {
    $.getJSON('/session', function (data) {
      AppDispatcher.handleViewAction({
        actionType: SessionConstants.LOGGED_IN,
        loggedIn: data.logged_in
      });
    });
  }
};

module.exports = SessionActions;