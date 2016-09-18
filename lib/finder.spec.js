/* jshint expr:true */

var expect = require('chai').expect;
var sinon = require('sinon');

var Finder = require('./finder');

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

  it('should find no symlinks if single target resolves to no links', function () {
    targetLister.list.returns(promiseOf(['the target']));

    targetParser.parse.withArgs('the target').returns([]);

    return finder.findSymlinks()
      .then(function (symlinks) {
        expect(symlinks).to.be.empty;
      });
  });

  it('should find symlinks for multiple targets', function () {
    targetLister.list.returns(promiseOf([
      'first target',
      'second target'
    ]));

    targetParser.parse.withArgs('first target').returns(['first link']);
    targetParser.parse.withArgs('second target').returns(['second link']);

    return finder.findSymlinks()
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
      });
  });

  it('should find multiple symlinks for a single target', function () {
    targetLister.list.returns(promiseOf(['the target']));

    targetParser.parse.withArgs('the target').returns([
      'first link',
      'second link'
    ]);

    return finder.findSymlinks()
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
      });
  });

  function promiseOf(value) {
    return Promise.resolve(value);
  }
});
