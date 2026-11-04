import { compile } from 'tailwindcss';
import fs from 'fs';
import path from 'path';

export async function buildTailwindCss() {
  const rootDir = process.cwd();
  const inputCssPath = path.join(rootDir, 'src/renderer/src/index.css');
  const outputCssPath = path.join(rootDir, 'src/renderer/src/compiled-tailwind.css');

  // 1. Read input CSS
  const rawCss = fs.readFileSync(inputCssPath, 'utf8');

  // Separate @import "tailwindcss" and @custom-variant from custom CSS
  const customCss = rawCss
    .replace('@import "tailwindcss";', '')
    .replace('@custom-variant dark (&:where(.dark, .dark *));', '');

  // 2. Scan all candidates from renderer source files
  const filesToScan = [];
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(tsx|ts|jsx|js|html)$/.test(entry.name)) {
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
        // filter out pure numbers or short noise
        if (m.length > 1 && !/^\d+$/.test(m)) {
          candidatesSet.add(m);
        }
      }
    }
  }

  const candidates = Array.from(candidatesSet);

  // 3. Compile Tailwind 4 with class-based selector dark mode (.dark)
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

  // 4. Combine compiled tailwind utilities + our custom design system tokens & classes
  const finalCss = `/* Auto-generated Tailwind CSS - Do Not Edit Directly */
${compiledTailwind}

/* Custom WaSell Design System Tokens & Classes */
${customCss}
`;

  fs.writeFileSync(outputCssPath, finalCss, 'utf8');
  console.log(`✓ Tailwind compiled successfully to ${outputCssPath}`);
  console.log(`  Candidates scanned: ${candidates.length}`);
  console.log(`  Output CSS size: ${(finalCss.length / 1024).toFixed(1)} KB`);
}

buildTailwindCss().catch(console.error);
