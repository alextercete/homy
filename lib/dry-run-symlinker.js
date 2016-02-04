module.exports = DryRunSymlinker;

function DryRunSymlinker() {
  this.link = link;

  function link(name, target) {
    return console.log('Would\'ve linked:', denormalized('~/' + name), '->', denormalized('./' + target));
  }

  function denormalized(path) {
    return path.replace('\\', '/');
  }
}
