var ConfigurationBasedFinder = require('./configuration-based-finder');
var ConfigurationLister = require('./configuration-lister');
var ConfigurationReader = require('./configuration-reader');
var ConventionBasedFinder = require('./convention-based-finder');

exports.create = create;

function create(strategy, fileSystem, operatingSystem) {
  return {
    configuration: createConfigurationBasedFinder,
    convention: createConventionBasedFinder
  }[strategy](fileSystem, operatingSystem);
}

function createConfigurationBasedFinder(fileSystem, operatingSystem) {
  var lister = new ConfigurationLister(fileSystem);
  var reader = new ConfigurationReader(fileSystem, operatingSystem);
  return new ConfigurationBasedFinder(lister, reader);
}

function createConventionBasedFinder(fileSystem, operatingSystem) {
  return new ConventionBasedFinder(fileSystem, operatingSystem);
}
