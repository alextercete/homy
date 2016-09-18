var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Symlinker = require('./symlinker');

var path = require('path');

describe('Symlinker', function () {
  var fileSystem, operatingSystem, symlinker;

  beforeEach(function () {
    fileSystem = {
      createSymlink: sinon.stub()
    };

    operatingSystem = {
      home: sinon.stub()
    };

    symlinker = new Symlinker(fileSystem, operatingSystem);
  });

  it('should create symlinks to the home folder', function () {
    operatingSystem.home.returns('/home/user');

    fileSystem.createSymlink.returns(promiseOf(undefined));

    return symlinker.link('.file', 'path/to/.file.symlink')
      .then(function () {
        expect(fileSystem.createSymlink).to.have.been.calledWith(
          joined('/home/user', '.file'), 'path/to/.file.symlink');
      });
  });

  function joined(directory, file) {
    return path.join(directory, file);
  }

  function promiseOf(value) {
    return Promise.resolve(value);
  }
});
