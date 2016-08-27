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

  it('should parse OS-specific target', function () {
    operatingSystem.platform.returns('the_os');
    var links = targetParser.parse('.file.the_os-symlink');
    expect(links).to.deep.equal(['.file']);
  });
});
