module.exports = ConfigurationReader;

function ConfigurationReader(fileSystem, operatingSystem) {
  this.read = read;

  function read() {
    throw new Error('Not implemented');
  }
}
