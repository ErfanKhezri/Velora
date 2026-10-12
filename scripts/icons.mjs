// Generates PWA and Tauri source icons from an inline SVG: `node scripts/icons.mjs`
import sharp from "sharp";

const mark = (size, pad) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e9b7b1"/><stop offset="0.55" stop-color="#f3d4d0"/><stop offset="1" stop-color="#dec58e"/>
    </linearGradient>
  </defs>
  ${pad ? '<rect width="512" height="512" fill="url(#g)"/>' : '<rect width="512" height="512" rx="112" fill="url(#g)"/>'}
  <g transform="translate(256 256) scale(${pad ? 0.62 : 0.8}) translate(-256 -256)" fill="none" stroke="#2a1a24" stroke-width="26" stroke-linecap="round" stroke-linejoin="round">
    <path d="M150 160l106 212 106-212"/>
    <path d="M216 166c16 32 64 32 80 0"/>
  </g>
</svg>`;

const out = [
  ["public/icons/icon-192.png", 192, false],
  ["public/icons/icon-512.png", 512, false],
  ["public/icons/icon-maskable-512.png", 512, true],
  ["public/icons/apple-touch-icon.png", 180, true],
  ["src-tauri/app-icon.png", 1024, false],
];

for (const [file, size, pad] of out) {
  await sharp(Buffer.from(mark(size, pad))).png().toFile(file);
  console.log("wrote", file);
}
