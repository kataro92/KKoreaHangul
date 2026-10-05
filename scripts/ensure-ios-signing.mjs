#!/usr/bin/env node
/**
 * Prepare iOS automatic signing before device builds.
 * Expo skips -allowProvisioningUpdates when DEVELOPMENT_TEAM is already set
 * in the Xcode project but no provisioning profile exists yet.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const iosDir = path.join(root, 'ios');
const require = createRequire(import.meta.url);

const TEAM_ID = process.env.APPLE_TEAM_ID ?? '7HG9BF8LGF';

function log(message) {
  console.log(`› ${message}`);
}

function ensureQuotes(value) {
  if (!value.match(/^['"]/)) {
    return `"${value}"`;
  }
  return value;
}

function applyAutomaticSigning() {
  const { IOSConfig } = require('@expo/config-plugins');
  const project = IOSConfig.XcodeUtils.getPbxproj(root);
  const targets = IOSConfig.Target.findSignableTargets(project);
  const quotedTeamId = ensureQuotes(TEAM_ID);

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

  fs.writeFileSync(project.filepath, project.writeSync());
}

function clearDevelopmentTeamFromBuildSettings() {
  const { IOSConfig } = require('@expo/config-plugins');
  const project = IOSConfig.XcodeUtils.getPbxproj(root);
  const targets = IOSConfig.Target.findSignableTargets(project);

  for (const [, nativeTarget] of targets) {
    IOSConfig.XcodeUtils.getBuildConfigurationsForListId(
      project,
      nativeTarget.buildConfigurationList
    )
      .filter(([, item]) => item.buildSettings.PRODUCT_NAME)
      .forEach(([, item]) => {
        delete item.buildSettings.DEVELOPMENT_TEAM;
      });
  }

  fs.writeFileSync(project.filepath, project.writeSync());
}

if (!fs.existsSync(iosDir)) {
  console.error('ios/ folder not found. Run: npx expo prebuild --platform ios');
  process.exit(1);
}

applyAutomaticSigning();
clearDevelopmentTeamFromBuildSettings();
log(`Automatic signing prepared for team ${TEAM_ID}`);
