var path = require('path');

module.exports = ConventionBasedFinder;
ConventionBasedFinder.create = create;

function ConventionBasedFinder(fileSystem, operatingSystem) {
  this.findSymlinks = findSymlinks;

  function baseNameOf(file) {
    return path.basename(file, extensionOf(file));
  }

  function byExtension(file) {
    var platform = operatingSystem.platform();
    var symlinkExtensionRegex = new RegExp('^\\.(' + platform + '-)?symlink$');
    return symlinkExtensionRegex.test(extensionOf(file));
  }

  function extensionOf(file) {
    return path.extname(file);
  }

  function findByConvention(files) {
    return files.filter(byExtension).map(toSymlink);
  }

  function findSymlinks() {
    return fileSystem.listDirectory().then(findByConvention);
  }

  function toSymlink(file) {
    return {
      name: baseNameOf(file),
      target: file
    };
  }
}

function create(fileSystem, operatingSystem) {
  return new ConventionBasedFinder(fileSystem, operatingSystem);
}
