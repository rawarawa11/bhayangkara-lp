/**
 * Image optimization script — converts public/images/* to WebP
 * Run: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.resolve(__dirname, '../public/images');

const tasks = [
    {
        input: path.join(imgDir, 'rs-gambar.jpeg'),
        output: path.join(imgDir, 'rs-gambar.webp'),
        // Hero LCP image: resize to max width 1440, quality 82
        options: { width: 1440, withoutEnlargement: true },
        webp: { quality: 82, effort: 6 },
    },
    {
        input: path.join(imgDir, 'logo-polri.png'),
        output: path.join(imgDir, 'logo-polri.webp'),
        // Logo: preserve transparency, quality 90
        options: { width: 128, withoutEnlargement: true },
        webp: { quality: 90, lossless: false, effort: 6 },
    },
    {
        input: path.join(imgDir, 'logo-rs.webp'),
        output: path.join(imgDir, 'logo-rs-opt.webp'),
        // Re-compress existing webp
        options: { width: 128, withoutEnlargement: true },
        webp: { quality: 85, effort: 6 },
    },
];

async function formatBytes(filePath) {
    try {
        const s = await stat(filePath);
        return `${(s.size / 1024).toFixed(1)} KiB`;
    } catch { return 'N/A'; }
}

for (const task of tasks) {
    const before = await formatBytes(task.input);
    await sharp(task.input)
        .resize(task.options)
        .webp(task.webp)
        .toFile(task.output);
    const after = await formatBytes(task.output);
    console.log(`✓ ${path.basename(task.input)} → ${path.basename(task.output)}: ${before} → ${after}`);
}

console.log('\nDone. Update src references to use .webp paths.');
