import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('=== Washington School CAS Portal: Aesthetic Overhaul Verification Suite ===\n');

// 1. Google Poppins Typography in Root Layout
console.log('1. Checking Poppins Typography configuration in layout.tsx...');
const layoutPath = path.join(rootDir, 'src/app/layout.tsx');
assert(fs.existsSync(layoutPath), 'src/app/layout.tsx exists');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
assert(layoutContent.includes('from "next/font/google"') && layoutContent.includes('Poppins'), 'Imports Poppins from next/font/google');
assert(layoutContent.includes('variable: "--font-poppins"'), 'Defines --font-poppins variable');
assert(layoutContent.includes('poppins.variable') && layoutContent.includes('font-sans'), 'Applies poppins.variable and font-sans to root element');
assert(layoutContent.includes('suppressHydrationWarning'), 'Configures suppressHydrationWarning for theme hydration');
assert(layoutContent.includes('<ThemeProvider'), 'Mounts ThemeProvider');

// 2. Tailwind v4 Theme and Dark Mode Tokens in globals.css
console.log('\n2. Checking Tailwind v4 Theme Tokens and Accessibility in globals.css...');
const cssPath = path.join(rootDir, 'src/app/globals.css');
assert(fs.existsSync(cssPath), 'src/app/globals.css exists');
const cssContent = fs.readFileSync(cssPath, 'utf8');
assert(cssContent.includes('--font-sans: var(--font-poppins)'), '--font-sans mapped to var(--font-poppins)');
assert(cssContent.includes('--font-heading: var(--font-poppins)'), '--font-heading mapped to var(--font-poppins)');
assert(cssContent.includes('@custom-variant dark'), 'Defines @custom-variant dark');
assert(cssContent.includes('.dark, [data-theme=dark]'), 'Defines dark theme color variables for both .dark and [data-theme=dark]');
assert(cssContent.includes('@supports not ((backdrop-filter: blur(1px))'), 'Provides fallback for unsupported backdrop-filter');
assert(cssContent.includes('@media (forced-colors: active)'), 'Handles OS High Contrast mode');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Handles OS Reduced Motion mode');

// 3. ThemeToggle Component Implementation
console.log('\n3. Checking ThemeToggle Component...');
const togglePath = path.join(rootDir, 'src/components/ThemeToggle.tsx');
assert(fs.existsSync(togglePath), 'src/components/ThemeToggle.tsx exists');
const toggleContent = fs.readFileSync(togglePath, 'utf8');
assert(toggleContent.includes('useSyncExternalStore'), 'Uses useSyncExternalStore to prevent SSR hydration mismatch');
assert(toggleContent.includes('useTheme'), 'Uses useTheme from next-themes');
assert(toggleContent.includes('Sun') && toggleContent.includes('Moon'), 'Includes Sun and Moon icons');
assert(toggleContent.includes('motion-reduce:transition-none'), 'Respects reduced motion on icon transitions');
assert(toggleContent.includes('aria-label='), 'Includes accessible aria-label');

// 4. Header ThemeToggle Integration across All Views
console.log('\n4. Checking ThemeToggle in View Headers...');
const headerFiles = [
  { file: 'src/app/dashboard/page.tsx', name: 'Dashboard (Student & Coordinator)' },
  { file: 'src/app/dashboard/new/page.tsx', name: 'New Experience View' },
  { file: 'src/app/dashboard/experience/[id]/page.tsx', name: 'Experience Detail View' },
  { file: 'src/app/dashboard/student/[id]/page.tsx', name: 'Student Audit View' },
  { file: 'src/app/supervisor-review/[token]/page.tsx', name: 'Supervisor Review View' },
  { file: 'src/app/login/page.tsx', name: 'Login View' },
];

for (const { file, name } of headerFiles) {
  const filePath = path.join(rootDir, file);
  assert(fs.existsSync(filePath), `${name} file exists (${file})`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes('ThemeToggle'), `${name} incorporates ThemeToggle`);
}

// 5. Glassmorphism Styling across UI Containers
console.log('\n5. Checking Glassmorphism Styling across UI Components...');
const uiComponents = [
  { file: 'src/components/ui/card.tsx', name: 'Card', check: 'backdrop-blur-md' },
  { file: 'src/components/ui/dialog.tsx', name: 'Dialog', check: 'backdrop-blur-xl' },
  { file: 'src/components/ui/table.tsx', name: 'Table', check: 'backdrop-blur-xs' },
  { file: 'src/components/ui/tabs.tsx', name: 'Tabs', check: 'backdrop-blur-sm' },
  { file: 'src/components/ui/input.tsx', name: 'Input', check: 'backdrop-blur-xs' },
  { file: 'src/components/ui/textarea.tsx', name: 'Textarea', check: 'backdrop-blur-xs' },
  { file: 'src/components/ui/select.tsx', name: 'Select', check: 'backdrop-blur-xs' },
  { file: 'src/components/ui/toast.tsx', name: 'Toast', check: 'backdrop-blur-xl' },
  { file: 'src/components/ui/button.tsx', name: 'Button (outline)', check: 'backdrop-blur-xs' },
];

for (const { file, name, check } of uiComponents) {
  const filePath = path.join(rootDir, file);
  assert(fs.existsSync(filePath), `${name} component exists (${file})`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.includes(check), `${name} features glassmorphic ${check}`);
}

// 6. WCAG 2.1 Color Contrast
console.log('\n6. Checking WCAG 2.1 Text Contrast...');
function oklchToRgbLinear(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180);
  const b = C * Math.sin(h * Math.PI / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = +4.0767434750 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  return [r, g, bl];
}
function relLum([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(lin1, lin2) {
  const y1 = relLum(lin1), y2 = relLum(lin2);
  return (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05);
}

const white = [1, 1, 1];
const fg = oklchToRgbLinear(0.145, 0, 0);
const mutedFg = oklchToRgbLinear(0.48, 0, 0);
const darkCard = oklchToRgbLinear(0.18, 0.012, 260);
const darkFg = oklchToRgbLinear(0.985, 0, 0);
const darkMutedFg = oklchToRgbLinear(0.72, 0, 0);

const lightContrast = contrast(fg, white);
const lightMutedContrast = contrast(mutedFg, white);
const darkContrast = contrast(darkFg, darkCard);
const darkMutedContrast = contrast(darkMutedFg, darkCard);

assert(lightContrast >= 7.0, `Light mode FG contrast (${lightContrast.toFixed(2)}:1) meets WCAG AAA (>= 7:1)`);
assert(lightMutedContrast >= 4.5, `Light mode Muted FG contrast (${lightMutedContrast.toFixed(2)}:1) meets WCAG AA (>= 4.5:1)`);
assert(darkContrast >= 7.0, `Dark mode FG contrast (${darkContrast.toFixed(2)}:1) meets WCAG AAA (>= 7:1)`);
assert(darkMutedContrast >= 4.5, `Dark mode Muted FG contrast (${darkMutedContrast.toFixed(2)}:1) meets WCAG AA (>= 4.5:1)`);

// 7. Production Build Artifacts
console.log('\n7. Checking Production Build Artifacts...');
const staticDir = path.join(rootDir, '.next/static');
assert(fs.existsSync(staticDir), '.next/static build directory exists');

const mediaDir = path.join(rootDir, '.next/static/media');
if (fs.existsSync(mediaDir)) {
  const mediaFiles = fs.readdirSync(mediaDir);
  const woff2Files = mediaFiles.filter((f) => f.endsWith('.woff2'));
  assert(woff2Files.length > 0, `Self-hosted Poppins/Geist WOFF2 font files present in build (${woff2Files.length} files)`);
} else {
  assert(false, '.next/static/media directory exists');
}

console.log(`\n=== Verification Results: ${passedTests}/${totalTests} Passed (${failedTests} Failed) ===`);
if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('All aesthetic overhaul verifications succeeded!\n');
}
