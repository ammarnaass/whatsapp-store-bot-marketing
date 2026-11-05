import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const iconsDir = path.join(buildDir, 'icons');
const svgPath = path.join(buildDir, 'icon.svg');

export async function generateIcons() {
  if (!fs.existsSync(svgPath)) {
    console.error(`[Icons] SVG icon not found at ${svgPath}`);
    process.exit(1);
  }

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // تحديد الأمر المتاح (magick أو convert)
  let cmd = 'magick';
  try {
    execSync('magick --version', { stdio: 'ignore' });
  } catch {
    try {
      execSync('convert --version', { stdio: 'ignore' });
      cmd = 'convert';
    } catch {
      console.warn('[Icons] Warning: ImageMagick (magick/convert) not found. Skipping auto icon generation.');
      return;
    }
  }

  console.log(`[Icons] Using ImageMagick (${cmd}) to generate multi-platform branding assets...`);

  // 1. توليد أيقونة الماستر 512x512 للينكس
  const masterPng = path.join(buildDir, 'icon.png');
  execSync(`${cmd} -background none "${svgPath}" -resize 512x512 "${masterPng}"`);
  console.log(`✓ Master PNG created: ${masterPng} (512x512)`);

  // 2. توليد المقاسات المعيارية لنظام لينكس
  const SIZES = [16, 32, 48, 64, 128, 256, 512];
  for (const size of SIZES) {
    const outPath = path.join(iconsDir, `${size}x${size}.png`);
    execSync(`${cmd} -background none "${svgPath}" -resize ${size}x${size} "${outPath}"`);
  }
  console.log(`✓ Linux application icons generated (${SIZES.join(', ')})`);

  // 3. توليد أيقونة ويندوز متعددة الطبقات (Multi-resolution Windows .ico)
  const winIco = path.join(buildDir, 'icon.ico');
  execSync(`${cmd} -background none "${svgPath}" -define icon:auto-resize=256,128,64,48,32,16 "${winIco}"`);
  console.log(`✓ Windows multi-layer icon created: ${winIco}`);
}

generateIcons().catch(console.error);

