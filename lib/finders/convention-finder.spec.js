var expect = require('chai').expect;
var sinon = require('sinon');

var ConventionFinder = require('./convention-finder');

var Q = require('q');

describe('ConventionFinder', function () {
  var conventionFinder, fileSystem, operatingSystem;

  beforeEach(function () {
    fileSystem = {
      listDirectory: sinon.stub()
    };

    operatingSystem = {
      platform: sinon.stub()
    };

    conventionFinder = new ConventionFinder(fileSystem, operatingSystem);
  });

  it('should find files by convention', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.file1.linux-symlink',
      'path/to/.file2.symlink',
      'path/to/not-a-symlink'
    ]));

    operatingSystem.platform.returns('linux');

    conventionFinder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: '.file1',
            target: 'path/to/.file1.linux-symlink'
          },
          {
            name: '.file2',
            target: 'path/to/.file2.symlink'
          }
        ]);
      })
      .done(done);
  });

  it('should find folders by convention', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.directory.symlink',
      'path/to/.directory.symlink/inner-file1',
      'path/to/.directory.symlink/inner-file2',
      'path/to/not-a-symlink'
    ]));

    operatingSystem.platform.returns('linux');

    conventionFinder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: '.directory',
            target: 'path/to/.directory.symlink'
          }
        ]);
      })
      .done(done);
  });

  function promiseOf(value) {
    return Q.when(value);
  }
});
