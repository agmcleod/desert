var AppDispatcher = require("../dispatchers/AppDispatcher");
var JournalEntryConstants = require("../constants/JournalEntryConstants.js");

var JournalActions = {
  createEntry: function (data) {
    $.post("/journal.json", { entry: data }).done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.ENTRY_CREATE,
        entry: data
      });
    }).fail(function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.ENTRY_CREATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  },

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