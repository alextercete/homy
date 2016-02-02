var Q = require('q');
var _ = require('lodash');
var path = require('path');

module.exports = ConfigurationBasedFinder;

function ConfigurationBasedFinder(lister, reader) {
  this.findSymlinks = findSymlinks;

  function findSymlinks() {
    return lister.list()
      .then(readConfigurations)
      .then(_.flatten);
  }

  function readConfiguration(file) {
    var directory = path.dirname(file);

    return reader.read(file).then(function (items) {
      return items.map(function (item) {
        return {
          name: item.name,
          target: path.join(directory, item.target)
        };
      });
    });
  }

  function readConfigurations(files) {
    return Q.all(files.map(readConfiguration));
  }
}
