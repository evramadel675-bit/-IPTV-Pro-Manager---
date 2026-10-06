import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, r, g, b, isMaskable = false) {
  // Construct a minimal uncompressed or deflated PNG buffer with a gradient and centered TV/play box
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel + 1; // 1 filter byte per row
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      
      // Calculate normalized coordinates
      const nx = (x - width / 2) / (width / 2);
      const ny = (y - height / 2) / (height / 2);
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Background: Deep dark cyan-slate with neon emerald accent
      let pr = Math.round(15 + 10 * (y / height));
      let pg = Math.round(23 + 20 * (x / width));
      let pb = Math.round(42 + 25 * (y / height));
      let pa = 255;

      // Outer badge shape
      const badgeRadius = isMaskable ? 0.95 : 0.82;
      const isInsideBadge = Math.abs(nx) < 0.75 && Math.abs(ny) < 0.65;
      
      // Screen border / TV Box
      const tvX = Math.abs(nx);
      const tvY = Math.abs(ny);
      if (tvX < 0.62 && tvY < 0.48) {
        if (tvX > 0.54 || tvY > 0.40) {
          // TV Screen bezel (Emerald / Cyan neon)
          pr = 16;
          pg = 185;
          pb = 129;
        } else {
          // Screen interior
          pr = 10;
          pg = 15;
          pb = 26;

          // Play triangle inside screen
          // Triangle vertices: (-0.18, -0.20), (-0.18, 0.20), (0.22, 0)
          const tx = (nx + 0.18) / 0.40;
          const ty = ny / 0.25;
          if (nx >= -0.18 && nx <= 0.22 && Math.abs(ny) <= 0.25 * (1 - (nx + 0.18) / 0.40)) {
            // Neon cyan-green play symbol
            pr = 52;
            pg = 211;
            pb = 153;
          }
        }
      }

      // Small antenna
      if (Math.abs(nx) < 0.08 && ny > -0.65 && ny < -0.48) {
        pr = 16;
        pg = 185;
        pb = 129;
      }

      rawData[pixelOffset] = pr;
      rawData[pixelOffset + 1] = pg;
      rawData[pixelOffset + 2] = pb;
      rawData[pixelOffset + 3] = pa;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(6, 9); // color type RGBA
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  // CRC32
  let crc = 0xffffffff;
  for (let i = 4; i < 8 + len; i++) {
    const byte = chunk[i];
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Precompute CRC table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PNGs
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, 16, 185, 129, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, 16, 185, 129, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, 16, 185, 129, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, 16, 185, 129, false));

// Generate icon.svg
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0f172a" />
      <stop offset="1" stop-color="#064e3b" />
    </linearGradient>
    <linearGradient id="glow" x1="120" y1="120" x2="392" y2="380" gradientUnits="userSpaceOnUse">
      <stop stop-color="#10b981" />
      <stop offset="1" stop-color="#06b6d4" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#bg)" />
  <rect x="72" y="110" width="368" height="260" rx="36" stroke="url(#glow)" stroke-width="20" fill="#030712" />
  <path d="M256 110 V64 M216 64 H296" stroke="#10b981" stroke-width="16" stroke-linecap="round" />
  <path d="M220 180 L320 240 L220 300 Z" fill="url(#glow)" />
  <circle cx="390" cy="150" r="10" fill="#10b981" />
  <circle cx="390" cy="190" r="8" fill="#34d399" opacity="0.6" />
</svg>`;
fs.writeFileSync(path.join(publicDir, 'icon.svg'), svg);

console.log('PWA icons generated successfully in /public');
