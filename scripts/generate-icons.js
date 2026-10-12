// Gera os ícones e a splash do app sem dependências (só Node + zlib).
// Desenho (Dev Cards): um card branco com o símbolo </> em azul (#2D4BE0),
// inclinado -4°, sobre um card azul-claro (#7F96FF) inclinado 11°.
// Determinístico: a mesma entrada gera sempre os mesmos bytes.
//
// Uso: npm run icons   (grava em assets/ e o ícone da loja em store/play/)

const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const BLUE = [0x2d, 0x4b, 0xe0];
const BACK = [0x7f, 0x96, 0xff];
const WHITE = [0xff, 0xff, 0xff];
const SUPERSAMPLE = 3;

/** Os dois cards têm o mesmo tamanho e giram em torno do mesmo ponto. */
const CARD = { x0: 28, y0: 24, x1: 72, y1: 78, r: 7 };
const PIVOT = { cx: 50, cy: 51 };
/** Traços do </>: os dois sinais e a barra, cada um uma linha de pontos. */
const CODE = [
  [
    [43, 44],
    [37, 51],
    [43, 58],
  ],
  [
    [57, 44],
    [63, 51],
    [57, 58],
  ],
  [
    [52.5, 41],
    [47.5, 61],
  ],
];

/**
 * Formas numa caixa de 100×100 (as mesmas medidas do SVG do design), pintadas em ordem.
 * `rot` gira a forma, em graus no sentido horário, em torno de (cx, cy).
 */
function shapes(mono) {
  return [
    { kind: 'rect', ...CARD, ...PIVOT, rot: 11, color: mono ? WHITE : BACK, alpha: mono ? 0.5 : 1 },
    { kind: 'rect', ...CARD, ...PIVOT, rot: -4, color: WHITE, alpha: 1 },
    { kind: 'stroke', lines: CODE, width: 3.8, ...PIVOT, rot: -4, color: BLUE, alpha: 1, erase: mono },
  ];
}

/** Gira o ponto de volta pelo ângulo da forma, para testar contra a forma sem rotação. */
function unrotate(px, py, s) {
  if (!s.rot) return [px, py];
  const a = (-s.rot * Math.PI) / 180;
  const dx = px - s.cx;
  const dy = py - s.cy;
  return [s.cx + dx * Math.cos(a) - dy * Math.sin(a), s.cy + dx * Math.sin(a) + dy * Math.cos(a)];
}

function insideRoundRect(px, py, s) {
  if (px < s.x0 || px > s.x1 || py < s.y0 || py > s.y1) return false;
  const dx = Math.max(s.x0 + s.r - px, 0, px - (s.x1 - s.r));
  const dy = Math.max(s.y0 + s.r - py, 0, py - (s.y1 - s.r));
  return dx * dx + dy * dy <= s.r * s.r;
}

/** Dentro do traço: a distância até algum segmento é no máximo metade da espessura (ponta redonda). */
function insideStroke(px, py, s) {
  const half = s.width / 2;
  for (const line of s.lines) {
    for (let k = 1; k < line.length; k++) {
      const [ax, ay] = line[k - 1];
      const [bx, by] = line[k];
      const vx = bx - ax;
      const vy = by - ay;
      const t = Math.min(1, Math.max(0, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
      const ex = px - (ax + t * vx);
      const ey = py - (ay + t * vy);
      if (ex * ex + ey * ey <= half * half) return true;
    }
  }
  return false;
}

function inside(px, py, s) {
  const [x, y] = unrotate(px, py, s);
  return s.kind === 'stroke' ? insideStroke(x, y, s) : insideRoundRect(x, y, s);
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
          // Coordenadas na caixa de 100×100 do desenho.
          const u = (((x + (sx + 0.5) / SUPERSAMPLE) / size - offset) / area) * 100;
          const v = (((y + (sy + 0.5) / SUPERSAMPLE) / size - offset) / area) * 100;
          let pr = 0,
            pg = 0,
            pb = 0,
            pa = 0;
          if (background) [pr, pg, pb, pa] = [background[0] / 255, background[1] / 255, background[2] / 255, 1];
          for (const s of list) {
            if (!inside(u, v, s)) continue;
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

// A caixa de 100×100 já tem a margem do desenho, então o ícone cheio usa area 1.
// Frente e monocromático do adaptativo usam 0,64 para o card caber na área segura
// circular do Android (61% do lado).
const ICONS = [
  { file: 'icon.png', size: 1024, background: BLUE, area: 1, alpha: false },
  { file: 'android-icon-foreground.png', size: 512, background: null, area: 0.64, alpha: true },
  { file: 'android-icon-background.png', size: 512, background: BLUE, area: 0, alpha: false, solid: true },
  { file: 'android-icon-monochrome.png', size: 432, background: null, area: 0.64, alpha: true, mono: true },
  { file: 'splash-icon.png', size: 1024, background: null, area: 0.8, alpha: true },
  { file: 'favicon.png', size: 48, background: BLUE, area: 1, alpha: true },
];

/** Ícone da página do app na Play Store: o mesmo desenho do ícone principal. */
const STORE_ICONS = [{ file: 'play-icon-512.png', size: 512, background: BLUE, area: 1, alpha: false }];

function writeIcons(list, outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  for (const icon of list) {
    const pixels = icon.solid
      ? render(icon.size, { background: icon.background, area: 1e-9 })
      : render(icon.size, { background: icon.background, area: icon.area, mono: icon.mono });
    fs.writeFileSync(path.join(outDir, icon.file), encodePng(pixels, icon.size, icon.alpha));
  }
  return list.map((i) => i.file);
}

const generateIcons = (outDir) => writeIcons(ICONS, outDir);
const generateStoreIcons = (outDir) => writeIcons(STORE_ICONS, outDir);

module.exports = { generateIcons, generateStoreIcons };

if (require.main === module) {
  const files = generateIcons(path.resolve(__dirname, '../assets'));
  const store = generateStoreIcons(path.resolve(__dirname, '../store/play'));
  console.log(`ícones gerados em assets/: ${files.join(', ')}; em store/play/: ${store.join(', ')}`);
}
