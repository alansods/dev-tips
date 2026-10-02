// Gera os ícones e a splash do app sem dependências (só Node + zlib).
// Desenho: dois cards empilhados — o de trás em #273140 e o da frente no
// acento do design (#8296FF) com três linhas de "texto". Determinístico: a
// mesma entrada gera sempre os mesmos bytes.
//
// Uso: npm run icons   (grava em assets/)

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const BG = [0x0c, 0x10, 0x15];
const BACK = [0x27, 0x31, 0x40];
const FRONT = [0x82, 0x96, 0xff];
const LINE = [0x0a, 0x0f, 0x1f];
const WHITE = [0xff, 0xff, 0xff];
const SUPERSAMPLE = 3;

/** Formas em coordenadas unitárias (0..1) da área de desenho, pintadas em ordem. */
function shapes(mono) {
  const line = (y, x1) => ({ x0: 0.24, y0: y, x1, y1: y + 0.05, r: 0.025 });
  return [
    { x0: 0.3, y0: 0.12, x1: 0.86, y1: 0.66, r: 0.08, color: mono ? WHITE : BACK, alpha: mono ? 0.5 : 1 },
    { x0: 0.14, y0: 0.3, x1: 0.7, y1: 0.84, r: 0.08, color: mono ? WHITE : FRONT, alpha: 1 },
    { ...line(0.43, 0.6), color: LINE, alpha: 1, erase: mono },
    { ...line(0.54, 0.6), color: LINE, alpha: 1, erase: mono },
    { ...line(0.65, 0.47), color: LINE, alpha: 1, erase: mono },
  ];
}

function insideRoundRect(px, py, s) {
  if (px < s.x0 || px > s.x1 || py < s.y0 || py > s.y1) return false;
  const dx = Math.max(s.x0 + s.r - px, 0, px - (s.x1 - s.r));
  const dy = Math.max(s.y0 + s.r - py, 0, py - (s.y1 - s.r));
  return dx * dx + dy * dy <= s.r * s.r;
}

/**
 * Rasteriza o desenho num quadrado `size`×`size`.
 * @param {{ background?: number[] | null, area: number, mono?: boolean }} opts
 *   background: cor de fundo (null = transparente); area: fração do lado ocupada pelo desenho.
 * @returns {Buffer} pixels RGBA
 */
function render(size, { background = null, area, mono = false }) {
  const list = shapes(mono);
  const out = Buffer.alloc(size * size * 4);
  const offset = (1 - area) / 2;
  const n = SUPERSAMPLE * SUPERSAMPLE;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0; // soma pré-multiplicada
      for (let sy = 0; sy < SUPERSAMPLE; sy++) {
        for (let sx = 0; sx < SUPERSAMPLE; sx++) {
          const u = ((x + (sx + 0.5) / SUPERSAMPLE) / size - offset) / area;
          const v = ((y + (sy + 0.5) / SUPERSAMPLE) / size - offset) / area;
          let pr = 0,
            pg = 0,
            pb = 0,
            pa = 0;
          if (background) [pr, pg, pb, pa] = [background[0] / 255, background[1] / 255, background[2] / 255, 1];
          for (const s of list) {
            if (!insideRoundRect(u, v, s)) continue;
            if (s.erase) {
              [pr, pg, pb, pa] = [0, 0, 0, 0];
              continue;
            }
            const sa = s.alpha;
            pr = (s.color[0] / 255) * sa + pr * (1 - sa);
            pg = (s.color[1] / 255) * sa + pg * (1 - sa);
            pb = (s.color[2] / 255) * sa + pb * (1 - sa);
            pa = sa + pa * (1 - sa);
          }
          r += pr;
          g += pg;
          b += pb;
          a += pa;
        }
      }
      const i = (y * size + x) * 4;
      const alpha = a / n;
      out[i + 3] = Math.round(alpha * 255);
      if (alpha > 0) {
        out[i] = Math.round((r / n / alpha) * 255);
        out[i + 1] = Math.round((g / n / alpha) * 255);
        out[i + 2] = Math.round((b / n / alpha) * 255);
      }
    }
  }
  return out;
}

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Codifica pixels RGBA como PNG RGBA (colorType 6) ou RGB (colorType 2, descartando o alfa). */
function encodePng(rgba, size, withAlpha) {
  const channels = withAlpha ? 4 : 3;
  const raw = Buffer.alloc(size * (size * channels + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size * channels + 1);
    raw[row] = 0; // filtro "None"
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = row + 1 + x * channels;
      raw[dst] = rgba[src];
      raw[dst + 1] = rgba[src + 1];
      raw[dst + 2] = rgba[src + 2];
      if (withAlpha) raw[dst + 3] = rgba[src + 3];
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bits por canal
  ihdr[9] = withAlpha ? 6 : 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const ICONS = [
  { file: 'icon.png', size: 1024, background: BG, area: 0.72, alpha: false },
  { file: 'android-icon-foreground.png', size: 512, background: null, area: 0.5, alpha: true },
  { file: 'android-icon-background.png', size: 512, background: BG, area: 0, alpha: false, solid: true },
  { file: 'android-icon-monochrome.png', size: 432, background: null, area: 0.5, alpha: true, mono: true },
  { file: 'splash-icon.png', size: 1024, background: null, area: 0.8, alpha: true },
  { file: 'favicon.png', size: 48, background: BG, area: 0.84, alpha: true },
];

function generateIcons(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const icon of ICONS) {
    const pixels = icon.solid
      ? render(icon.size, { background: icon.background, area: 1e-9 })
      : render(icon.size, { background: icon.background, area: icon.area, mono: icon.mono });
    fs.writeFileSync(path.join(outDir, icon.file), encodePng(pixels, icon.size, icon.alpha));
  }
  return ICONS.map((i) => i.file);
}

module.exports = { generateIcons };

if (require.main === module) {
  const files = generateIcons(path.resolve(__dirname, '../assets'));
  console.log(`ícones gerados em assets/: ${files.join(', ')}`);
}
