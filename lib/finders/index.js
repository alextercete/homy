var ConfigurationBasedFinder = require('./configuration-based-finder');
var ConventionBasedFinder = require('./convention-based-finder');

exports.create = create;

function create(strategy, fileSystem, operatingSystem) {
  return {
    configuration: ConfigurationBasedFinder.create,
    convention: ConventionBasedFinder.create
  }[strategy](fileSystem, operatingSystem);
}
