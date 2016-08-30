module.exports = Installer;

function Installer(finder, symlinker) {
  this.install = install;

  function install() {
    return finder.findSymlinks().then(createSymlinks);
  }

  function createSymlink(symlink) {
    return symlinker.link(symlink.name, symlink.target);
  }

  function createSymlinks(symlinks) {
    return Promise.all(symlinks.map(createSymlink));
  }
}
