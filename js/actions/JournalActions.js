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

  getEntryInformation: function (id) {
    $.get('/journal/' + id + '.json').done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.ENTRY_SHOW,
        entry: data
      });
    })
  },

  list: function () {
    $.get("/journal.json").done(function (data) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.JOURNAL_LIST,
        entries: data
      });
    });
  },

  updateEntry: function (data) {
    $.ajax({
      url: "/journal/" + data.id + ".json",
      data: { entry: { title: data.title, markdown_content: data.markdown_content } },
      type: "PUT"
    }).done(function (data) {
      data.updated = true;
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.ENTRY_UPDATE,
        entry: data
      });
    }).fail(function (jqXHR) {
      AppDispatcher.handleViewAction({
        actionType: JournalEntryConstants.ENTRY_UPDATE_FAIL,
        errors: jqXHR.responseJSON.errors
      });
    });
  }
}

module.exports = JournalActions;