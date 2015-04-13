function LocalStorageSync (key) {
  this.key = key;
}

LocalStorageSync.prototype.getById = function (id) {
  this.getParsedData()["" + id];
}

LocalStorageSync.prototype.getParsedData = function () {
  return JSON.parse(window.localStorage.getItem(this.key) || "{}");
}

LocalStorageSync.prototype.isOffline = function (jqXHR) {
  return (jqXHR.statusText === "error" && jqXHR.status === 0) || jqXHR.statusText === "timeout";
}

LocalStorageSync.prototype.mergeFrom = function (objectSet) {
  var json = {};
  for (var id in objectSet) {
    if (objectSet.hasOwnProperty(id)) {
      json[id] = objectSet[id];
    }
  }

  window.localStorage.setItem(this.key, JSON.stringify(json));
}

LocalStorageSync.prototype.removeObject = function (id) {
  var json = this.getParsedData();
  delete json["" + id];
  this.setAll(json);
};

LocalStorageSync.prototype.set = function (object) {
  var json = this.getParsedData();
  json[""+ object._id] = object;
  this.setAll(json);
}

LocalStorageSync.prototype.setArray = function (array) {
  var json = this.getParsedData();
  for (var i = array.length - 1; i >= 0; i--) {
    var object = array[i];
    json[""+ object._id] = object;
  }
  this.setAll(json);
}

LocalStorageSync.prototype.setAll = function (object) {
  window.localStorage.setItem(this.key, JSON.stringify(object));
}

module.exports = LocalStorageSync;