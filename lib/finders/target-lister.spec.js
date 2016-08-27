var expect = require('chai').expect;
var sinon = require('sinon');

var TargetLister = require('./target-lister');

var Q = require('q');

describe('TargetLister', function () {
  var fileSystem, operatingSystem, targetLister;

  beforeEach(function () {
    fileSystem = {
      listDirectory: sinon.stub()
    };

    operatingSystem = {
      platform: sinon.stub()
    };

    targetLister = new TargetLister(fileSystem, operatingSystem);
  });

  it('should list global targets', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.file.symlink',
      '.file.symlink',
      'not-a-symlink'
    ]));

    targetLister.list()
      .then(function (targets) {
        expect(targets).to.deep.equal([
          'path/to/.file.symlink',
          '.file.symlink'
        ]);
      })
      .done(done);
  });

  it('should list OS-specific targets', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.file.the_os-symlink',
      '.file.the_os-symlink',
      'not-a-symlink'
    ]));

    operatingSystem.platform.returns('the_os');

    targetLister.list()
      .then(function (targets) {
        expect(targets).to.deep.equal([
          'path/to/.file.the_os-symlink',
          '.file.the_os-symlink'
        ]);
      })
      .done(done);
  });

  it('should list target directories', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.directory.symlink',
      'path/to/.directory.symlink/file1',
      'path/to/.directory.symlink/file2'
    ]));

    targetLister.list()
      .then(function (targets) {
        expect(targets).to.deep.equal([
          'path/to/.directory.symlink'
        ]);
      })
      .done(done);
  });

  function promiseOf(value) {
    return Q.when(value);
  }
});
