exports.create = create;

function create(strategy, fileSystem, operatingSystem) {
  var finder = require('./' + strategy + '-finder');
  return finder.create(fileSystem, operatingSystem);
}
