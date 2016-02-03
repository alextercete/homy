var path = require('path');

module.exports = ConfigurationLister;

function ConfigurationLister(fileSystem) {
  this.list = list;

  function list() {
    return fileSystem.listDirectory().then(pickConfigurationFiles);
  }

  function pickConfigurationFiles(files) {
    return files.filter(function (file) {
      return path.basename(file) === 'symlinks.yml';
    });
  }
}
