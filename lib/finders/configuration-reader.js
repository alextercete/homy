var _ = require('lodash');
var yaml = require('js-yaml');

module.exports = ConfigurationReader;

function ConfigurationReader(fileSystem, operatingSystem) {
  this.read = read;

  function read(path) {
    return fileSystem.readFile(path)
      .then(yaml.load)
      .then(parse);
  }

  function parse(rawConfiguration) {
    if (_.isArray(rawConfiguration)) {
      return parseItems(rawConfiguration);
    }

    var defaultConfiguration = parseItems(rawConfiguration['default']);
    var environmentSpecificConfiguration = parseItems(rawConfiguration[operatingSystem.platform()]);

    return _.unionBy(environmentSpecificConfiguration, defaultConfiguration, 'target');
  }

  function parseItem(rawItem) {
    var parts = rawItem.split(/\s*[=-]>\s*/);

    return {
      name: _.first(parts),
      target: _.last(parts)
    };
  }

  function parseItems(rawConfiguration) {
    return (rawConfiguration || []).map(parseItem);
  }
}
