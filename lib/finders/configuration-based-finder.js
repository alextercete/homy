var Q = require('q');
var _ = require('lodash');
var path = require('path');

var ConfigurationLister = require('./configuration-lister');
var ConfigurationReader = require('./configuration-reader');

module.exports = ConfigurationBasedFinder;
ConfigurationBasedFinder.create = create;

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

function create(fileSystem, operatingSystem) {
  var lister = new ConfigurationLister(fileSystem);
  var reader = new ConfigurationReader(fileSystem, operatingSystem);
  return new ConfigurationBasedFinder(lister, reader);
}
