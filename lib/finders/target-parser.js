var path = require('path');

module.exports = TargetParser;

function TargetParser(operatingSystem) {
  this.parse = parse;

  function baseNameOf(file) {
    return path.basename(file, extensionOf(file));
  }

  function extensionOf(file) {
    return path.extname(file);
  }

  function parse(target) {
    return [baseNameOf(target)];
  }
}
