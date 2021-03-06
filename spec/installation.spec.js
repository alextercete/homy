var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Finder = require('../lib/finder');
var Installer = require('../lib/installer');
var Symlinker = require('../lib/symlinker');
var TargetLister = require('../lib/target-lister');
var TargetParser = require('../lib/target-parser');

var path = require('path');

describe('Installation', function () {
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

    var targetLister = new TargetLister(fileSystem);
    var targetParser = new TargetParser(operatingSystem);
    var finder = new Finder(targetLister, targetParser);
    var symlinker = new Symlinker(fileSystem, operatingSystem);
    installer = new Installer(finder, symlinker);
  });

  it('should symlink files', function () {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.gitconfig.symlink',
      'path/to/[linux].gitconfig_include.symlink'
    ]));

    operatingSystem.home.returns('/home/user');
    operatingSystem.platform.returns('linux');

    return installer.install()
      .then(function () {
        expect(fileSystem.createSymlink).to.have.callCount(2);
        expect(fileSystem.createSymlink).to.have.been.calledWith(
          joined('/home/user', '.gitconfig'), 'path/to/.gitconfig.symlink');
        expect(fileSystem.createSymlink).to.have.been.calledWith(
          joined('/home/user', '.gitconfig_include'), 'path/to/[linux].gitconfig_include.symlink');
      });
  });

  function joined(directory, file) {
    return path.join(directory, file);
  }

  function promiseOf(value) {
    return Promise.resolve(value);
  }
});
