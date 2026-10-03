// Remove a capacidade de notificações push (aps-environment) que o
// expo-notifications acrescenta no iOS. O Dev Tips só usa notificações locais,
// que não precisam dela, e a conta Apple grátis (Personal Team) não consegue
// assinar apps com push.
const { withEntitlementsPlist } = require('expo/config-plugins');

module.exports = function withoutPushEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    delete cfg.modResults['aps-environment'];
    return cfg;
  });
};
