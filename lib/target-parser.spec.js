/* jshint expr:true */

var expect = require('chai').expect;
var sinon = require('sinon');

var TargetParser = require('./target-parser');

describe('TargetParser', function () {
  var operatingSystem, targetParser;

  beforeEach(function () {
    operatingSystem = {
      platform: sinon.stub()
    };

    targetParser = new TargetParser(operatingSystem);
  });

  it('should parse global target', function () {
    var links = targetParser.parse('.file.symlink');
    expect(links).to.deep.equal(['.file']);
  });

  it('should parse OS-specific target with a single OS that matches', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('[the_os].file.symlink');
    expect(links).to.deep.equal(['.file']);
  });

  it('should parse OS-specific target with a single OS that doesn\'t match', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('[another_os].file.symlink');
    expect(links).to.be.empty;
  });

  it('should parse OS-specific target with multiple OS\'s that match', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('[the_os,another_os].file.symlink');
    expect(links).to.deep.equal(['.file']);
  });

  it('should parse OS-specific target with multiple OS\'s that don\'t match', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('[other_os,another_os].file.symlink');
    expect(links).to.be.empty;
  });

  it('should parse OS-specific target with an excluded OS that matches', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('[-the_os].file.symlink');
    expect(links).to.be.empty;
  });

  it('should parse OS-specific target with an excluded OS that doesn\'t match', function () {
    operatingSystem.platform.returns('not_the_os');
    var links = targetParser.parse('[-the_os].file.symlink');
    expect(links).to.deep.equal(['.file']);
  });

  it('should parse composite target into multiple links', function () {
    operatingSystem.platform.returns('the_os');

    var links = targetParser.parse('.file1;[the_os].file2.symlink');

    expect(links).to.deep.equal([
      '.file1',
      '.file2'
    ]);
  });
});
