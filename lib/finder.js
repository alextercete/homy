var _ = require('lodash');

module.exports = Finder;

function Finder(targetLister, targetParser) {
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
