const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins');
const fs = require('node:fs/promises');
const path = require('node:path');

// Keep credentials outside generated android/ so prebuild cannot replace the key.
// Without local credentials the release stays unsigned, never debug-signed.
const signingBlock = `// KKOREA_PLAY_SIGNING_START
def playSigningFile = new File(rootProject.projectDir.parentFile, '.secrets/play-signing.properties')
def playSigningProperties = new Properties()
if (playSigningFile.exists()) {
    playSigningFile.withInputStream { playSigningProperties.load(it) }
}
android {
    if (playSigningFile.exists()) {
        signingConfigs {
            playUpload {
                storeFile new File(playSigningFile.parentFile, playSigningProperties['storeFile'])
                storePassword playSigningProperties['storePassword']
                keyAlias playSigningProperties['keyAlias']
                keyPassword playSigningProperties['keyPassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig playSigningFile.exists() ? signingConfigs.playUpload : null
        }
    }
}
// KKOREA_PLAY_SIGNING_END`;

module.exports = function withPlayUploadSigning(config) {
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language !== 'groovy') {
      throw new Error('Play upload signing expects a Groovy app/build.gradle.');
    }
    let contents = config.modResults.contents.replace(
      /\n?\/\/ KKOREA_PLAY_SIGNING_START[\s\S]*?\/\/ KKOREA_PLAY_SIGNING_END\n?/g,
      '\n'
    );
    // Leave the debug build unchanged; replace only the generated release fallback.
    contents = contents.replace(
      /(release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
      '$1signingConfig null'
    );
    config.modResults.contents = `${contents.trimEnd()}\n\n${signingBlock}\n`;
    return config;
  });
  // RN 0.83.2 ships Foojay 0.5.0, which references IBM_SEMERU removed in
  // Gradle 9. AGP 8.12 supports Gradle 8.14.3; keep prebuild reproducible.
  return withDangerousMod(config, ['android', async (config) => {
    const wrapper = path.join(config.modRequest.platformProjectRoot, 'gradle/wrapper/gradle-wrapper.properties');
    const contents = await fs.readFile(wrapper, 'utf8');
    await fs.writeFile(wrapper, contents.replace(/gradle-[\d.]+-bin\.zip/, 'gradle-8.14.3-bin.zip'));
    // React Native caches the application package using lockfile hashes, which
    // do not change when app.json changes. Regenerate it after a package rename.
    const autolinking = path.join(config.modRequest.platformProjectRoot, 'build/generated/autolinking/autolinking.json');
    let cachedAutolinking;
    try {
      cachedAutolinking = JSON.parse(await fs.readFile(autolinking, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (cachedAutolinking && cachedAutolinking.project?.android?.packageName !== config.android.package) {
      await fs.unlink(autolinking);
    }
    return config;
  }]);
};
