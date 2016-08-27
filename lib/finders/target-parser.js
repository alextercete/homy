var path = require('path');

module.exports = TargetParser;

function TargetParser(operatingSystem) {
  var EXPRESSION_SEPARATOR = ';';
  var PLATFORM_ATTRIBUTES_PATTERN = /^\[(.*?)\](.*?)$/;
  var PLATFORM_SEPARATOR = ',';

  this.parse = parse;

  function baseNameOf(file) {
    return path.basename(file, extensionOf(file));
  }

  function extensionOf(file) {
    return path.extname(file);
  }

  function matchPlatform(attribute) {
    var platform = operatingSystem.platform();

    if (attribute.startsWith('-')) {
      return attribute.substring(1) !== platform;
    }

    return attribute === platform;
  }

  function parse(target) {
    return baseNameOf(target).split(EXPRESSION_SEPARATOR).reduce(toLinks, []);
  }

  function toLinks(links, expression) {
    var match = expression.match(PLATFORM_ATTRIBUTES_PATTERN);

    if (!match) {
      return links.concat(expression);
    }

    var platformAttributes = match[1].split(PLATFORM_SEPARATOR);

    if (platformAttributes.some(matchPlatform)) {
      links.push(match[2]);
    }

    return links;
  }
}
