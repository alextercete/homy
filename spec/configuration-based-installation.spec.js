var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Installer = require('../lib/installer');
var Symlinker = require('../lib/symlinker');
var finders = require('../lib/finders');

var Q = require('q');
var os = require('os');
var path = require('path');

describe('Configuration-based installation', function () {
  var fileSystem, installer, operatingSystem;

  beforeEach(function () {
    fileSystem = {
      createSymlink: sinon.spy(),
      listDirectory: sinon.stub(),
      readFile: sinon.stub()
    };

    operatingSystem = {
      home: sinon.stub(),
      platform: sinon.stub()
    };

    var finder = finders.create('configuration', fileSystem, operatingSystem);
    var symlinker = new Symlinker(fileSystem, operatingSystem);
    installer = new Installer(finder, symlinker);
  });

  it('should symlink files', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.vim',
      'path/to/.vimrc',
      'path/to/symlinks.yml'
    ]));

    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      'default:',
      '  - .vim',
      '  - .vimrc',
      'windows:',
      '  - vimfiles -> .vim'
    ])));

    operatingSystem.home.returns('/home/user');
    operatingSystem.platform.returns('windows');

    installer.install()
      .then(function () {
        expect(fileSystem.createSymlink).to.have.callCount(2);
        expect(fileSystem.createSymlink)
          .to.have.been.calledWith(normalized('/home/user/vimfiles'), normalized('path/to/.vim'));
        expect(fileSystem.createSymlink)
          .to.have.been.calledWith(normalized('/home/user/.vimrc'), normalized('path/to/.vimrc'));
      })
      .done(done);
  });

  function multiline(lines) {
    return lines.join(os.EOL);
  }

  function normalized(filePath) {
    return path.normalize(filePath);
  }

  function promiseOf(value) {
    return Q.when(value);
  }
});
