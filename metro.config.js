const path = require('node:path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Gradle's Windows Unix-domain sockets live here; Metro cannot stat/watch them.
// These local build artifacts and signing files are never app source/assets.
const localArtifacts = ['release', '.secrets'].map(directory => {
  const root = path.join(__dirname, directory).split(/[\\/]/)
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\\\/]');
  return new RegExp(`${root}[\\\\/].*`);
});
const existing = config.resolver.blockList;
config.resolver.blockList = [...(Array.isArray(existing) ? existing : existing ? [existing] : []), ...localArtifacts];

module.exports = config;
