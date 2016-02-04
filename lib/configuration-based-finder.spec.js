var expect = require('chai').expect;
var sinon = require('sinon');

var ConfigurationBasedFinder = require('./configuration-based-finder');

var Q = require('q');
var os = require('os');
var path = require('path');

describe('ConfigurationBasedFinder', function () {
  var configurationBasedFinder, lister, reader;

  beforeEach(function () {
    lister = {
      list: sinon.stub()
    };

    reader = {
      read: sinon.stub()
    };

    configurationBasedFinder = new ConfigurationBasedFinder(lister, reader);
  });

  it('should find single file in the same directory', function (done) {
    lister.list.returns(promiseOf([
      'path/to/symlinks.yml'
    ]));

    reader.read.withArgs('path/to/symlinks.yml').returns(promiseOf([
      {
        name: '.file1',
        target: '.file1'
      }
    ]));

    configurationBasedFinder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: '.file1',
            target: joined('path/to', '.file1')
          }
        ]);
      })
      .done(done);
  });

  it('should find single file in inner directory', function (done) {
    lister.list.returns(promiseOf([
      'path/to/symlinks.yml'
    ]));

    reader.read.withArgs('path/to/symlinks.yml').returns(promiseOf([
      {
        name: '.file1',
        target: 'inner/.file1'
      }
    ]));

    configurationBasedFinder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: '.file1',
            target: joined('path/to', 'inner/.file1')
          }
        ]);
      })
      .done(done);
  });

  it('should find multiple files', function (done) {
    lister.list.returns(promiseOf([
      'directory1/symlinks.yml',
      'directory2/symlinks.yml'
    ]));

    reader.read.withArgs('directory1/symlinks.yml').returns(promiseOf([
      {
        name: '.file11',
        target: '.file11'
      },
      {
        name: '.file12',
        target: '.file12'
      }
    ]));

    reader.read.withArgs('directory2/symlinks.yml').returns(promiseOf([
      {
        name: '.file2',
        target: '.file2'
      }
    ]));

    configurationBasedFinder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: '.file11',
            target: joined('directory1', '.file11')
          },
          {
            name: '.file12',
            target: joined('directory1', '.file12')
          },
          {
            name: '.file2',
            target: joined('directory2', '.file2')
          }
        ]);
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
