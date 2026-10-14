import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawPixel) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth: 8
  ihdr.writeUInt8(6, 9); // color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression method
  ihdr.writeUInt8(0, 11); // filter method
  ihdr.writeUInt8(0, 12); // interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with 0 filter byte per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowSize);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(chunk.subarray(4, 8 + length));
  chunk.writeUInt32BE(crc, 8 + length);
  return chunk;
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Draw a sleek Vercel monochrome black/white icon
function drawIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Rounded icon background (pure black squircle)
  const cornerRadius = w * 0.22;
  const qx = Math.max(0, Math.abs(dx) - (w * 0.45 - cornerRadius));
  const qy = Math.max(0, Math.abs(dy) - (h * 0.45 - cornerRadius));
  const cornerDist = Math.sqrt(qx * qx + qy * qy);

  if (cornerDist > cornerRadius) {
    return [0, 0, 0, 0]; // Transparent
  }

  // Border highlight (subtle #262626 stroke around outer edge)
  const isBorder = cornerDist > cornerRadius - (w * 0.05);

  // Eye shape in crisp white
  const eyeWidth = w * 0.54;
  const eyeHeight = h * 0.32;
  const eyeNormX = dx / (eyeWidth / 2);
  const eyeNormY = dy / (eyeHeight / 2);
  const inEyeShape = (eyeNormX * eyeNormX + eyeNormY * eyeNormY) <= 1.0;
  
  // Pupil
  const pupilRadius = w * 0.12;
  const inPupil = dist <= pupilRadius;

  // Slash bar for "anti-bias/blind" across center (45-degree angle)
  const slashDist = Math.abs(dx + dy) / Math.SQRT2;
  const inSlash = slashDist <= (w * 0.055) && dist <= (w * 0.36);

  if (inSlash) {
    return [255, 255, 255, 255]; // Crisp white slash
  }

  if (inPupil) {
    return [255, 255, 255, 255]; // Crisp white pupil
  }

  if (inEyeShape) {
    const edgeDist = Math.abs(eyeNormX * eyeNormX + eyeNormY * eyeNormY - 0.7);
    if (edgeDist < 0.3) {
      return [255, 255, 255, 220]; // Crisp white eye contour
    }
  }

  if (isBorder) {
    return [40, 40, 40, 255]; // Vercel border #282828
  }

  return [10, 10, 10, 255]; // Dark background #0a0a0a
}

const iconsDir = path.resolve('public', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [16, 32, 48, 128];
for (const size of sizes) {
  const pngBuf = createPNG(size, size, drawIcon);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), pngBuf);
  console.log(`Generated icon-${size}.png (${size}x${size})`);
}
