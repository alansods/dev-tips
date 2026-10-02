/**
 * @jest-environment node
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '../..');
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8'));

describe('Requirement: Identidade visual (configuração)', () => {
  it('Configuração do app', () => {
    const { expo } = read('app.json');
    expect(expo.name).toBe('Dev Tips');
    expect(expo.icon).toBe('./assets/icon.png');
    expect(expo.android.adaptiveIcon.backgroundColor).toBe('#0C1015');
    const splash = expo.plugins.find((p: unknown) => Array.isArray(p) && p[0] === 'expo-splash-screen');
    expect(splash?.[1]).toMatchObject({ image: './assets/splash-icon.png', backgroundColor: '#0C1015' });
  });
});

describe('Requirement: Configuração de build', () => {
  it('Perfis de build', () => {
    const eas = read('eas.json');
    expect(Object.keys(eas.build).sort()).toEqual(['development', 'preview', 'production']);
    expect(eas.build.development).toMatchObject({ developmentClient: true, distribution: 'internal' });
    expect(eas.build.preview).toMatchObject({ distribution: 'internal', android: { buildType: 'apk' } });
  });

  it('Identificadores do app', () => {
    const { expo } = read('app.json');
    expect(expo.ios.bundleIdentifier).toBeTruthy();
    expect(expo.android.package).toBe(expo.ios.bundleIdentifier);
  });
});
