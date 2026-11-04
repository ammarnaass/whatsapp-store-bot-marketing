import { compile } from 'tailwindcss';
import fs from 'fs';
import path from 'path';

/**
 * حل استيرادات CSS المعيارية محلياً ودمجها في كتلة واحدة
 */
function resolveCssImports(filePath, seen = new Set()) {
  if (seen.has(filePath)) return '';
  seen.add(filePath);
  if (!fs.existsSync(filePath)) return '';

  const raw = fs.readFileSync(filePath, 'utf8');
  const dir = path.dirname(filePath);

  return raw.replace(/@import\s+['"]([^'"]+)['"];/g, (match, importPath) => {
    if (importPath === 'tailwindcss') return '';
    const resolvedPath = path.resolve(dir, importPath);
    if (fs.existsSync(resolvedPath)) {
      return resolveCssImports(resolvedPath, seen);
    }
    return match;
  });
}

export async function buildTailwindCss() {
  const rootDir = process.cwd();
  const inputCssPath = path.join(rootDir, 'src/renderer/src/index.css');
  const outputCssPath = path.join(rootDir, 'src/renderer/src/compiled-tailwind.css');

  // 1. حل واستخراج كافة قواعد الـ CSS المخصصة من النظام المعياري
  const resolvedCss = resolveCssImports(inputCssPath);
  const customCss = resolvedCss
    .replace('@import "tailwindcss";', '')
    .replace('@custom-variant dark (&:where(.dark, .dark *));', '')
    .trim();

  // 2. فحص كافة الفئات (Classes) المستخدمة في كود الواجهة
  const filesToScan = [];
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(tsx|ts|jsx|js|html|css)$/.test(entry.name)) {
        filesToScan.push(fullPath);
      }
    }
  }

  scanDir(path.join(rootDir, 'src/renderer/src'));
  scanDir(path.join(rootDir, 'src/renderer'));

  const candidatesSet = new Set();
  const candidateRegex = /([a-zA-Z0-9_\-\:\[\]\/\#\%\.\!]+)/g;

  for (const file of filesToScan) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(candidateRegex);
    if (matches) {
      for (const m of matches) {
        if (m.length > 1 && !/^\d+$/.test(m)) {
          candidatesSet.add(m);
        }
      }
    }
  }

  const candidates = Array.from(candidatesSet);

  // 3. تصريف فئات Tailwind 4 مع دعم الوضع الليلي المعتمد على .dark
  const compiler = await compile('@import "tailwindcss";\n@custom-variant dark (&:where(.dark, .dark *));', {
    base: rootDir,
    loadStylesheet: async (id, base) => {
      const tailwindDir = path.join(rootDir, 'node_modules/tailwindcss');
      if (id === 'tailwindcss' || id === './index.css') {
        const content = fs.readFileSync(path.join(tailwindDir, 'index.css'), 'utf8');
        return { path: path.join(tailwindDir, 'index.css'), base: tailwindDir, content };
      }
      if (id === './theme.css') {
        const content = fs.readFileSync(path.join(tailwindDir, 'theme.css'), 'utf8');
        return { path: path.join(tailwindDir, 'theme.css'), base: tailwindDir, content };
      }
      if (id === './preflight.css') {
        const content = fs.readFileSync(path.join(tailwindDir, 'preflight.css'), 'utf8');
        return { path: path.join(tailwindDir, 'preflight.css'), base: tailwindDir, content };
      }
      if (id === './utilities.css') {
        const content = fs.readFileSync(path.join(tailwindDir, 'utilities.css'), 'utf8');
        return { path: path.join(tailwindDir, 'utilities.css'), base: tailwindDir, content };
      }
      const fullPath = path.resolve(base, id);
      const content = fs.readFileSync(fullPath, 'utf8');
      return { path: fullPath, base: path.dirname(fullPath), content };
    }
  });

  const compiledTailwind = compiler.build(candidates);

  // 4. ربط قيم ألوان الهوية الثابتة بمتغيرات السمة التفاعلية
  const dynamicTailwind = compiledTailwind.replace(/\{([^{}]+)\}/g, (_, body) => {
    const updated = body
      .replace(/#128C7E/gi, 'var(--color-brand-primary, #128C7E)')
      .replace(/#075E54/gi, 'var(--color-primary-dark, #075E54)')
      .replace(/#0E7A6E/gi, 'var(--color-primary-dark, #0E7A6E)')
      .replace(/#0D6D61/gi, 'var(--color-primary-dark, #0D6D61)')
      .replace(/#E7F6F2/gi, 'var(--color-brand-light-bg, #E7F6F2)')
      .replace(/#25D366/gi, 'var(--color-brand-accent, #25D366)');
    return `{${updated}}`;
  });

  // 5. دمج فئات Tailwind مع رموز وتنسيقات نظام تصميم واسل المعياري
  const finalCss = `/* Auto-generated Tailwind CSS & WaSell Design System - Do Not Edit Directly */
${dynamicTailwind}

/* ========================================================
   WaSell Modular Design System Tokens & Component Classes
   ======================================================== */
${customCss}
`;

  fs.writeFileSync(outputCssPath, finalCss, 'utf8');
  console.log(`✓ Tailwind & WaSell Design System compiled to ${outputCssPath}`);
  console.log(`  Candidates scanned: ${candidates.length}`);
  console.log(`  Output CSS size: ${(finalCss.length / 1024).toFixed(1)} KB`);
}

buildTailwindCss().catch(console.error);
