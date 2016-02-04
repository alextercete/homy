var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var ConfigurationReader = require('./configuration-reader');

var Q = require('q');
var os = require('os');
var path = require('path');

describe('ConfigurationReader', function () {
  var fileSystem, operatingSystem, reader;

  beforeEach(function () {
    fileSystem = {
      readFile: sinon.stub()
    };

    operatingSystem = {
      platform: sinon.stub()
    };

    reader = new ConfigurationReader(fileSystem, operatingSystem);
  });

  it('should read simplified configuration file', function (done) {
    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      '- .vim',
      '- .vimrc'
    ])));

    reader.read('path/to/symlinks.yml')
      .then(function (configuration) {
        expect(configuration).to.deep.have.members([
          {
            name: '.vim',
            target: '.vim'
          },
          {
            name: '.vimrc',
            target: '.vimrc'
          }
        ]);
      })
      .done(done);
  });

  it('should read configuration file', function (done) {
    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      'default:',
      '  - .vim',
      '  - .vimrc'
    ])));

    reader.read('path/to/symlinks.yml')
      .then(function (configuration) {
        expect(configuration).to.deep.have.members([
          {
            name: '.vim',
            target: '.vim'
          },
          {
            name: '.vimrc',
            target: '.vimrc'
          }
        ]);
      })
      .done(done);
  });

  it('should read configuration file with environment-specific items', function (done) {
    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      'default:',
      '  - .vim',
      '  - .vimrc',
      'windows:',
      '  - _vimrc'
    ])));

    operatingSystem.platform.returns('windows');

    reader.read('path/to/symlinks.yml')
      .then(function (configuration) {
        expect(configuration).to.deep.have.members([
          {
            name: '.vim',
            target: '.vim'
          },
          {
            name: '.vimrc',
            target: '.vimrc'
          },
          {
            name: '_vimrc',
            target: '_vimrc'
          }
        ]);
      })
      .done(done);
  });

  it('should read configuration file with environment-specific overrides', function (done) {
    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      'default:',
      '  - .vim',
      '  - .vimrc',
      'windows:',
      '  - vimfiles -> .vim'
    ])));

    operatingSystem.platform.returns('windows');

    reader.read('path/to/symlinks.yml')
      .then(function (configuration) {
        expect(configuration).to.deep.have.members([
          {
            name: 'vimfiles',
            target: '.vim'
          },
          {
            name: '.vimrc',
            target: '.vimrc'
          }
        ]);
      })
      .done(done);
  });

  it('should read configuration file in environment with no specified items', function (done) {
    fileSystem.readFile.withArgs('path/to/symlinks.yml').returns(promiseOf(multiline([
      'default:',
      '  - .vim',
      '  - .vimrc',
      'windows:',
      '  - _vimrc'
    ])));

    operatingSystem.platform.returns('linux');

    reader.read('path/to/symlinks.yml')
      .then(function (configuration) {
        expect(configuration).to.deep.have.members([
          {
            name: '.vim',
            target: '.vim'
          },
          {
            name: '.vimrc',
            target: '.vimrc'
          }
        ]);
      })
      .done(done);
  });

  function multiline(lines) {
    return lines.join(os.EOL);
  }

  function promiseOf(value) {
    return Q.when(value);
  }
});
