var ConfigurationFinder = require('./configuration-finder');
var ConventionFinder = require('./convention-finder');

exports.create = create;

function create(strategy, fileSystem, operatingSystem) {
  return {
    configuration: ConfigurationFinder.create,
    convention: ConventionFinder.create
  }[strategy](fileSystem, operatingSystem);
}
