var expect = require('chai').expect;
var sinon = require('sinon');

var TargetLister = require('./target-lister');

describe('TargetLister', function () {
  var fileSystem, operatingSystem, targetLister;

  beforeEach(function () {
    fileSystem = {
      listDirectory: sinon.stub()
    };

    targetLister = new TargetLister(fileSystem);
  });

  it('should list target files', function () {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.file.symlink',
      '.file.symlink',
      'not-a-symlink'
    ]));

    return targetLister.list()
      .then(function (targets) {
        expect(targets).to.deep.equal([
          'path/to/.file.symlink',
          '.file.symlink'
        ]);
      });
  });

  it('should list target directories', function () {
    fileSystem.listDirectory.returns(promiseOf([
      'path/to/.directory.symlink',
      'path/to/.directory.symlink/file1',
      'path/to/.directory.symlink/file2'
    ]));

    return targetLister.list()
      .then(function (targets) {
        expect(targets).to.deep.equal([
          'path/to/.directory.symlink'
        ]);
      });
  });

  function promiseOf(value) {
    return Promise.resolve(value);
  }
});
