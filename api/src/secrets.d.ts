// Segredos que o `wrangler types` não enxerga (ficam no .dev.vars de cada máquina
// e em `wrangler secret put` na produção). Ver .dev.vars.example.
interface ApiSecrets {
  REVENUECAT_WEBHOOK_AUTH: string;
  REVENUECAT_SECRET_KEY: string;
  GEMINI_API_KEY: string;
  /** E-mails com acesso Pro sem pagar e sem cota, separados por vírgula (segredo: o repositório é público). */
  ADMIN_EMAILS: string;
}

interface Env extends ApiSecrets {}

declare namespace Cloudflare {
  interface Env extends ApiSecrets {}
}
