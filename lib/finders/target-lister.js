var path = require('path');

module.exports = TargetLister;

function TargetLister(fileSystem) {
  this.list = list;

  function byExtension(file) {
    return extensionOf(file) === '.symlink';
  }

  function extensionOf(file) {
    return path.extname(file);
  }

  function list() {
    return fileSystem.listDirectory().then(function (files) {
      return files.filter(byExtension);
    });
  }
}
