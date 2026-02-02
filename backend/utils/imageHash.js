const axios = require('axios');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

// 64-bit dHash (difference hash), encoded as 16-char hex string.
// Steps:
// - resize to 9x8
// - grayscale
// - compare adjacent pixels per row (9->8 comparisons) => 64 bits
function dHashFromRawGrayscale9x8(raw) {
  // raw length must be 72 (9*8)
  const bits = new Array(64);
  let bitIdx = 0;
  for (let row = 0; row < 8; row++) {
    const rowOffset = row * 9;
    for (let col = 0; col < 8; col++) {
      const left = raw[rowOffset + col];
      const right = raw[rowOffset + col + 1];
      bits[bitIdx++] = left > right ? 1 : 0;
    }
  }

  // Pack bits into hex (4 bits per nibble)
  let hex = '';
  for (let i = 0; i < 64; i += 4) {
    const nibble =
      (bits[i] << 3) |
      (bits[i + 1] << 2) |
      (bits[i + 2] << 1) |
      bits[i + 3];
    hex += nibble.toString(16);
  }
  return hex.padStart(16, '0');
}

async function dHashFromBuffer(buffer) {
  const img = await Jimp.read(buffer);
  img.resize(9, 8);
  img.greyscale();

  // Jimp stores RGBA bytes. After greyscale(), R=G=B; use R channel.
  const raw = Buffer.alloc(9 * 8);
  let idx = 0;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 9; x++) {
      const pixelIdx = (y * img.bitmap.width + x) * 4;
      raw[idx++] = img.bitmap.data[pixelIdx]; // R
    }
  }

  return dHashFromRawGrayscale9x8(raw);
}

async function dHashFromUrl(url) {
  const resp = await axios.get(url, { responseType: 'arraybuffer' });
  return dHashFromBuffer(Buffer.from(resp.data));
}

function isHttpUrl(v) {
  return typeof v === 'string' && /^https?:\/\//i.test(v);
}

function resolveLocalPublicAsset(maybePath) {
  if (typeof maybePath !== 'string') return null;
  const p = maybePath.trim();
  if (!p) return null;

  // Common patterns in this repo: "/products/xxx.jpg.jpeg"
  const normalized = p.startsWith('/') ? p.slice(1) : p;

  const repoRoot = path.resolve(__dirname, '..', '..');
  const frontendPublic = path.join(repoRoot, 'frontend', 'public');
  const abs = path.join(frontendPublic, normalized);

  // Prevent path traversal outside public dir
  const rel = path.relative(frontendPublic, abs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) return null;

  if (fs.existsSync(abs)) return abs;
  return null;
}

async function dHashFromImageRef(imageRef) {
  if (isHttpUrl(imageRef)) {
    return dHashFromUrl(imageRef);
  }

  const localPath = resolveLocalPublicAsset(imageRef);
  if (localPath) {
    const buf = fs.readFileSync(localPath);
    return dHashFromBuffer(buf);
  }

  throw new Error('Unsupported image reference (expected http(s) URL or local /public path)');
}

const NIBBLE_BITCOUNT = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];

function hammingDistanceHex64(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const aa = String(a).toLowerCase();
  const bb = String(b).toLowerCase();
  if (aa.length !== 16 || bb.length !== 16) return Number.POSITIVE_INFINITY;

  let dist = 0;
  for (let i = 0; i < 16; i++) {
    const na = parseInt(aa[i], 16);
    const nb = parseInt(bb[i], 16);
    if (Number.isNaN(na) || Number.isNaN(nb)) return Number.POSITIVE_INFINITY;
    dist += NIBBLE_BITCOUNT[na ^ nb];
  }
  return dist;
}

module.exports = {
  dHashFromBuffer,
  dHashFromUrl,
  dHashFromImageRef,
  hammingDistanceHex64,
};

