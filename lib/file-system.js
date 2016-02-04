var FS = require('q-io/fs');
var Q = require('q');
var path = require('path');

module.exports = FileSystem;

function FileSystem() {
  var maxDepth = 3;

  this.createSymlink = createSymlink;
  this.listDirectory = listDirectory;
  this.readFile = readFile;

  function createNewSymlink(link, target) {
    return getTypeOf(target).then(function (type) {
      return FS.symbolicLink(link, target, type).fail(handleLackOfPrivileges);
    });
  }

  function createSymlink(link, target) {
    return removeExisting(link).then(function () {
      return createNewSymlink(link, resolved(target));
    });
  }

  function exceedsMaxDepth(directory) {
    return directory.split(path.sep).length > maxDepth;
  }

  function getTypeOf(target) {
    return FS.isDirectory(target).then(function (isDirectory) {
      return isDirectory ? 'directory' : 'file';
    });
  }

  function handleLackOfPrivileges(error) {
    if (error.code === 'EPERM') {
      error = new Error('You do not have enough privileges to create symlinks');
    }

    return Q.reject(error);
  }

  function listDirectory() {
    return FS.listTree('.', function (directory) {
      return shouldIgnore(directory) ? null : true;
    });
  }

  function isReserved(directory) {
    return /(\.git|node_modules)$/.test(directory);
  }

  function readFile(file) {
    return FS.read(file);
  }

  function removeExisting(link) {
    return FS.isSymbolicLink(link).then(function (isSymbolicLink) {
      if (isSymbolicLink) {
        return FS.remove(link);
      }
    });
  }

  function resolved(target) {
    return path.resolve(target);
  }

  function shouldIgnore(directory) {
    return isReserved(directory) || exceedsMaxDepth(directory);
  }
}
