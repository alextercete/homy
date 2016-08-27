var _ = require('lodash');

module.exports = ConventionFinder;
ConventionFinder.create = create;

var TargetLister = require('./target-lister');
var TargetParser = require('./target-parser');

function ConventionFinder(targetLister, targetParser) {
  this.findSymlinks = findSymlinks;

  function findSymlinks() {
    return targetLister.list().then(function (targets) {
      return _(targets).map(toSymlink).flatten().value();
    });
  }

  function toSymlink(target) {
    var links = targetParser.parse(target);

    return links.map(function (link) {
      return {
        name: link,
        target: target
      };
    });
  }
}

function create(fileSystem, operatingSystem) {
  var targetLister = new TargetLister(fileSystem, operatingSystem);
  var targetParser = new TargetParser(operatingSystem);
  return new ConventionFinder(targetLister, targetParser);
}
