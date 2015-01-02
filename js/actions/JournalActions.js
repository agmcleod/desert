var AppDispatcher = require("../dispatchers/AppDispatcher");
var JournalEntryConstants = require("../constants/JournalEntryConstants.js");

var JournalActions = {
  list: function () {
    $.get("/journal.json").done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.JOURNAL_LIST,
        entries: data
      });
    });
  }
}

module.exports = JournalActions;