const { withEntitlementsPlist } = require('expo/config-plugins');

/**
 * Local scheduled reminders do not need the push (aps-environment) entitlement.
 * Free Apple Developer accounts cannot provision apps with Push Notifications.
 */
module.exports = function withLocalNotificationsOnly(config) {
  return withEntitlementsPlist(config, (config) => {
    delete config.modResults['aps-environment'];
    return config;
  });
};
