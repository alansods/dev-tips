/**
 * @jest-environment node
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateIcons } = require('../generate-icons');

const ASSETS = path.resolve(__dirname, '../../assets');

/** Lê largura, altura e tipo de cor do cabeçalho IHDR de um PNG. */
function pngInfo(file: string) {
  const buf = fs.readFileSync(file);
  expect(buf.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), colorType: buf[25] };
}
const RGB = 2;
const RGBA = 6;

describe('Requirement: Identidade visual', () => {
  it('Ícone principal', () => {
    expect(pngInfo(path.join(ASSETS, 'icon.png'))).toEqual({ width: 1024, height: 1024, colorType: RGB });
  });

  it('demais ícones têm tamanho e transparência certos', () => {
    expect(pngInfo(path.join(ASSETS, 'android-icon-foreground.png'))).toEqual({
      width: 512,
      height: 512,
      colorType: RGBA,
    });
    expect(pngInfo(path.join(ASSETS, 'android-icon-background.png'))).toEqual({
      width: 512,
      height: 512,
      colorType: RGB,
    });
    expect(pngInfo(path.join(ASSETS, 'android-icon-monochrome.png'))).toEqual({
      width: 432,
      height: 432,
      colorType: RGBA,
    });
    expect(pngInfo(path.join(ASSETS, 'splash-icon.png'))).toEqual({ width: 1024, height: 1024, colorType: RGBA });
    expect(pngInfo(path.join(ASSETS, 'favicon.png'))).toEqual({ width: 48, height: 48, colorType: RGBA });
  });

  it('Ícones reproduzíveis', () => {
    const a = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-a-'));
    const b = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-b-'));
    try {
      generateIcons(a);
      generateIcons(b);
      const files = fs.readdirSync(a).sort();
      expect(files).toEqual(fs.readdirSync(b).sort());
      for (const f of files)
        expect(fs.readFileSync(path.join(a, f)).equals(fs.readFileSync(path.join(b, f)))).toBe(true);
      // e são os mesmos que estão versionados em assets/
      for (const f of files)
        expect(fs.readFileSync(path.join(a, f)).equals(fs.readFileSync(path.join(ASSETS, f)))).toBe(true);
    } finally {
      fs.rmSync(a, { recursive: true, force: true });
      fs.rmSync(b, { recursive: true, force: true });
    }
  });
});
