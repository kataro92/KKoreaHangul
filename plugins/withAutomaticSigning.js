const { withXcodeProject, IOSConfig } = require('expo/config-plugins');

const TEAM_ID = '7HG9BF8LGF';

function ensureQuotes(value) {
  if (!value.match(/^['"]/)) {
    return `"${value}"`;
  }
  return value;
}

/**
 * Ensures Xcode automatic signing is enabled for all native targets.
 * Without TargetAttributes.ProvisioningStyle = Automatic, CLI builds can fail
 * even when CODE_SIGN_STYLE is set in build settings.
 */
module.exports = function withAutomaticSigning(config) {
  const appleTeamId = config.ios?.appleTeamId ?? TEAM_ID;

  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const targets = IOSConfig.Target.findSignableTargets(project);
    const quotedTeamId = ensureQuotes(appleTeamId);

    for (const [nativeTargetId, nativeTarget] of targets) {
      IOSConfig.XcodeUtils.getBuildConfigurationsForListId(
        project,
        nativeTarget.buildConfigurationList
      )
        .filter(([, item]) => item.buildSettings.PRODUCT_NAME)
        .forEach(([, item]) => {
          item.buildSettings.DEVELOPMENT_TEAM = quotedTeamId;
          item.buildSettings.CODE_SIGN_IDENTITY = '"Apple Development"';
          item.buildSettings.CODE_SIGN_STYLE = 'Automatic';
          item.buildSettings.PROVISIONING_PROFILE_SPECIFIER = '""';
        });

      Object.entries(IOSConfig.XcodeUtils.getProjectSection(project))
        .filter(IOSConfig.XcodeUtils.isNotComment)
        .forEach(([, item]) => {
          if (!item.attributes.TargetAttributes) {
            item.attributes.TargetAttributes = {};
          }
          if (!item.attributes.TargetAttributes[nativeTargetId]) {
            item.attributes.TargetAttributes[nativeTargetId] = {};
          }
          item.attributes.TargetAttributes[nativeTargetId].DevelopmentTeam = quotedTeamId;
          item.attributes.TargetAttributes[nativeTargetId].ProvisioningStyle = 'Automatic';
        });
    }

    return config;
  });
};
