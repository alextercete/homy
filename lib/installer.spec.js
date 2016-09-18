var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var Installer = require('./installer');

describe('Installer', function () {
  var finder, installer, symlinker;

  beforeEach(function () {
    finder = {
      findSymlinks: sinon.stub()
    };

    symlinker = {
      link: sinon.spy()
    };

    installer = new Installer(finder, symlinker);
  });

  it('should install symlinks', function () {
    finder.findSymlinks.returns(promiseOf([
      {
        name: '.file1',
        target: 'path/to/.file1.symlink'
      },
      {
        name: '.file2',
        target: 'path/to/.file2.symlink'
      }
    ]));

    return installer.install()
      .then(function () {
        expect(symlinker.link).to.have.been.calledWith('.file1', 'path/to/.file1.symlink');
        expect(symlinker.link).to.have.been.calledWith('.file2', 'path/to/.file2.symlink');
      });
  });

  function promiseOf(value) {
    return Promise.resolve(value);
  }
});
