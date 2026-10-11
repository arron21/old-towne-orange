import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const indexHtml = path.join(distDir, 'index.html');
const notFoundHtml = path.join(distDir, '404.html');

if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, notFoundHtml);
  console.log('✓ Successfully generated dist/404.html SPA fallback for GitHub Pages');
} else {
  console.warn('Warning: dist/index.html not found, skipping 404.html fallback generation.');
}
