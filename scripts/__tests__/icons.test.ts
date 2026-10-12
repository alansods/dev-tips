/**
 * @jest-environment node
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { generateIcons, generateStoreIcons } = require('../generate-icons');

const ASSETS = path.resolve(__dirname, '../../assets');
const STORE = path.resolve(__dirname, '../../store/play');

/** Lê largura, altura e tipo de cor do cabeçalho IHDR de um PNG. */
function pngInfo(file: string) {
  const buf = fs.readFileSync(file);
  expect(buf.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), colorType: buf[25] };
}
/** Pixels descomprimidos (junta os chunks IDAT e descomprime). */
function pngPixels(file: string) {
  const buf = fs.readFileSync(file);
  const idat: Buffer[] = [];
  for (let i = 8; i < buf.length;) {
    const length = buf.readUInt32BE(i);
    if (buf.toString('ascii', i + 4, i + 8) === 'IDAT') idat.push(buf.subarray(i + 8, i + 8 + length));
    i += 12 + length;
  }
  return zlib.inflateSync(Buffer.concat(idat));
}
const RGB = 2;
const RGBA = 6;

/** Cor do pixel em (x, y), dada em fração do lado (0..1), como hex "#RRGGBB". PNGs com filtro "None". */
function pixelAt(file: string, fx: number, fy: number) {
  const { width, colorType } = pngInfo(file);
  const channels = colorType === RGBA ? 4 : 3;
  const x = Math.floor(fx * width);
  const y = Math.floor(fy * width);
  const raw = pngPixels(file);
  const i = y * (width * channels + 1) + 1 + x * channels;
  return `#${[raw[i], raw[i + 1], raw[i + 2]].map((c) => c.toString(16).padStart(2, '0').toUpperCase()).join('')}`;
}
const BLUE = '#2D4BE0';

describe('Requirement: Identidade visual', () => {
  it('Ícone principal', () => {
    const icon = path.join(ASSETS, 'icon.png');
    expect(pngInfo(icon)).toEqual({ width: 1024, height: 1024, colorType: RGB });
    expect(pixelAt(icon, 0, 0)).toBe(BLUE);
  });

  it('Desenho do card', () => {
    const icon = path.join(ASSETS, 'icon.png');
    // Centro horizontal do card da frente, acima do símbolo </>.
    expect(pixelAt(icon, 0.5, 0.3)).toBe('#FFFFFF');
    // Fora dos cards.
    expect(pixelAt(icon, 0.1, 0.5)).toBe(BLUE);
  });

  it('Ícone da loja', () => {
    const store = path.join(STORE, 'play-icon-512.png');
    expect(pngInfo(store)).toEqual({ width: 512, height: 512, colorType: RGB });
    expect(pixelAt(store, 0, 0)).toBe(BLUE);
    expect(pixelAt(store, 0.5, 0.3)).toBe('#FFFFFF');
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
      // e têm o mesmo desenho dos versionados em assets/. Compara os pixels, e não
      // os bytes: a compressão do zlib muda entre versões do Node.
      for (const f of files) {
        expect(pngInfo(path.join(a, f))).toEqual(pngInfo(path.join(ASSETS, f)));
        expect(pngPixels(path.join(a, f)).equals(pngPixels(path.join(ASSETS, f)))).toBe(true);
      }
      // O ícone da loja também sai do gerador e bate com o versionado em store/play/.
      const s = fs.mkdtempSync(path.join(os.tmpdir(), 'icons-store-'));
      try {
        for (const f of generateStoreIcons(s))
          expect(pngPixels(path.join(s, f)).equals(pngPixels(path.join(STORE, f)))).toBe(true);
      } finally {
        fs.rmSync(s, { recursive: true, force: true });
      }
    } finally {
      fs.rmSync(a, { recursive: true, force: true });
      fs.rmSync(b, { recursive: true, force: true });
    }
  });
});
