var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var ConfigurationLister = require('./configuration-lister');

var Q = require('q');

describe('ConfigurationLister', function () {
  var fileSystem, lister;

  beforeEach(function () {
    fileSystem = {
      listDirectory: sinon.stub()
    };

    lister = new ConfigurationLister(fileSystem);
  });

  it('should list configuration files', function (done) {
    fileSystem.listDirectory.returns(promiseOf([
      'symlinks.yml',
      'inner/symlinks.yml',
      'another-file'
    ]));

    lister.list()
      .then(function (files) {
        expect(files).to.deep.equal([
          'symlinks.yml',
          'inner/symlinks.yml'
        ]);
      })
      .done(done);
  });

  function promiseOf(value) {
    return Q.when(value);
  }
});
