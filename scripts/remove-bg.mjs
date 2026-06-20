import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input  = path.join(__dirname, 'src/assets/giratorio.webp');
const output = path.join(__dirname, 'src/assets/giratorio-cutout.png');

// Leer la imagen y convertir a raw RGBA
const image = sharp(input);
const { width, height } = await image.metadata();

const { data } = await image
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8ClampedArray(data);

const SOLID = 220;   // más brillante que esto → transparente
const EDGE  = 185;   // zona de borde → semitransparente

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];

  // Luminosidad perceptual
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  if (lum >= SOLID) {
    pixels[i + 3] = 0;
  } else if (lum >= EDGE) {
    // Suavizado en el borde
    pixels[i + 3] = Math.round(((SOLID - lum) / (SOLID - EDGE)) * 255);
  }
}

await sharp(Buffer.from(pixels.buffer), {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(output);

console.log('✓ Cutout guardado en:', output);
