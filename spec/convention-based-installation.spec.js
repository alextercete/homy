var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var ConventionBasedFinder = require('../lib/finders/convention-based-finder');
var Installer = require('../lib/installer');
var Symlinker = require('../lib/symlinker');

var Q = require('q');
var path = require('path');

describe('Convention-based installation', function () {
  var fileSystem, installer, operatingSystem;

  beforeEach(function () {
    fileSystem = {
      createSymlink: sinon.spy(),
      listDirectory: sinon.stub()
    };

    operatingSystem = {
      home: sinon.stub(),
      platform: sinon.stub()
    };

    var finder = new ConventionBasedFinder(fileSystem, operatingSystem);
    var symlinker = new Symlinker(fileSystem, operatingSystem);
    installer = new Installer(finder, symlinker);
  });

  it('should symlink files', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.gitconfig.symlink',
      'path/to/.gitconfig_include.linux-symlink'
    ]));

    operatingSystem.home.returns('/home/user');
    operatingSystem.platform.returns('linux');

    installer.install()
      .then(function () {
        expect(fileSystem.createSymlink).to.have.callCount(2);
        expect(fileSystem.createSymlink).to.have.been.calledWith(
          joined('/home/user', '.gitconfig'), 'path/to/.gitconfig.symlink');
        expect(fileSystem.createSymlink).to.have.been.calledWith(
          joined('/home/user', '.gitconfig_include'), 'path/to/.gitconfig_include.linux-symlink');
      })
      .done(done);
  });

  function joined(directory, file) {
    return path.join(directory, file);
  }

  function promiseOf(value) {
    return Q.when(value);
  }
});
