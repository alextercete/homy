/* jshint expr:true */

var expect = require('chai').expect;
var sinon = require('sinon');

var Finder = require('./finder');

var Q = require('q');

describe('Finder', function () {
  var finder, targetLister, targetParser;

  beforeEach(function () {
    targetLister = {
      list: sinon.stub()
    };

    targetParser = {
      parse: sinon.stub()
    };

    finder = new Finder(targetLister, targetParser);
  });

  it('should find no symlinks if single target resolves to no links', function (done) {
    targetLister.list.returns(promiseOf(['the target']));

    targetParser.parse.withArgs('the target').returns([]);

    finder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.be.empty;
      })
      .done(done);
  });

  it('should find symlinks for multiple targets', function (done) {
    targetLister.list.returns(promiseOf([
      'first target',
      'second target'
    ]));

    targetParser.parse.withArgs('first target').returns(['first link']);
    targetParser.parse.withArgs('second target').returns(['second link']);

    finder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: 'first link',
            target: 'first target'
          },
          {
            name: 'second link',
            target: 'second target'
          }
        ]);
      })
      .done(done);
  });

  it('should find multiple symlinks for a single target', function (done) {
    targetLister.list.returns(promiseOf(['the target']));

    targetParser.parse.withArgs('the target').returns([
      'first link',
      'second link'
    ]);

    finder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.deep.equal([
          {
            name: 'first link',
            target: 'the target'
          },
          {
            name: 'second link',
            target: 'the target'
          }
        ]);
      })
      .done(done);
  });

  function promiseOf(value) {
    return Q.when(value);
  }
});
