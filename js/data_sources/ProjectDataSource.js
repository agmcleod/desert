var ProjectDataSource = {
  createProject: function (dataFields, success, error) {
    $.post("/projects.json", { project: dataFields }).done(success).fail(error);
  },

  getAll: function (success) {
    $.get("/projects.json").done(success);
  },

  getProject: function (id, success) {
    $.when($.get('/projects/' + id + '.json'), $.get('/projects/' + id + '/items.json')).done(success);
  },

  updateProject: function (data, success, error) {
    $.ajax({
      url: "/projects/" + data.id + ".json",
      data: { project: { title: data.title, description: data.description } },
      type: "PUT"
    }).done(success).fail(error);
  }
};

module.exports = ProjectDataSource;