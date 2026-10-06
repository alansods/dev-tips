// Segredos que o `wrangler types` não enxerga (ficam no .dev.vars de cada máquina
// e em `wrangler secret put` na produção). Ver .dev.vars.example.
interface RevenueCatSecrets {
  REVENUECAT_WEBHOOK_AUTH: string;
  REVENUECAT_SECRET_KEY: string;
}

interface Env extends RevenueCatSecrets {}

declare namespace Cloudflare {
  interface Env extends RevenueCatSecrets {}
}
