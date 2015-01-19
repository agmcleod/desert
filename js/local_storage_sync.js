function LocalStorageSync (key) {
  this.key = key;
}

LocalStorageSync.prototype.getParsedData = function () {
  return JSON.parse(window.localStorage.getItem(this.key) || "{}");
}

LocalStorageSync.prototype.removeObject = function (id) {
  var json = this.getParsedData();
  delete json["" + id];
  this.setAll(json);
};

LocalStorageSync.prototype.set = function (object) {
  var json = this.getParsedData();
  json[""+ object.id] = object;
  this.setAll(json);
}

LocalStorageSync.prototype.setAll = function (object) {
  window.localStorage.setItem(this.key, JSON.stringify(object));
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

module.exports = LocalStorageSync;