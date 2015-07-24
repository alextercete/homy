var Q = require('q');

module.exports = ConfigurationBasedFinder;

function ConfigurationBasedFinder() {
  this.findSymlinks = findSymlinks;

  function findSymlinks() {
    return Q.when([]);
  }
}
