import path from 'node:path';

import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

// Os testes rodam dentro do runtime do Workers (Miniflare), com o D1 local
// configurado no wrangler.jsonc. As migrations são aplicadas em test/setup.ts.
export default defineConfig({
  plugins: [
    cloudflareTest(async () => ({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        bindings: {
          TEST_MIGRATIONS: await readD1Migrations(path.join(__dirname, 'migrations')),
          JWT_SECRET: 'segredo-de-teste',
          GOOGLE_CLIENT_IDS: 'client-web.apps.googleusercontent.com,client-ios.apps.googleusercontent.com',
          ADMIN_EMAILS: 'admin@example.com',
          REVENUECAT_WEBHOOK_AUTH: 'segredo-do-webhook',
          REVENUECAT_SECRET_KEY: 'sk_teste',
        },
      },
    })),
  ],
  test: { setupFiles: ['./test/setup.ts'] },
});
