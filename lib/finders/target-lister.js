var path = require('path');

module.exports = TargetLister;

function TargetLister(fileSystem, operatingSystem) {
  this.list = list;

  function byExtension(file) {
    var platform = operatingSystem.platform();
    var symlinkExtensionRegex = new RegExp('^\\.(' + platform + '-)?symlink$');
    return symlinkExtensionRegex.test(extensionOf(file));
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
