const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const nsisOutputDir = path.join('apps', 'desktop', 'src-tauri', 'target', 'release', 'bundle', 'nsis');
const finalOutputDir = path.join('dist', 'desktop');

function commandExists(command) {
  const checker = process.platform === 'win32' ? 'where' : 'which';

  try {
    execSync(`${checker} ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function ensureDesktopBuildPrerequisites() {
  if (commandExists('cargo')) {
    return;
  }

  console.error('[dist:win] Missing Rust toolchain: cargo was not found on PATH.');
  console.error('[dist:win] Install Rust and restart your shell, then run dist again.');

  if (process.platform === 'win32') {
    console.error('[dist:win] Windows install options:');
    console.error('[dist:win]   1) winget install Rustlang.Rustup');
    console.error('[dist:win]   2) rustup default stable');
    console.error('[dist:win]   3) cargo --version');
  } else {
    console.error('[dist:win] Install via https://rustup.rs and verify with cargo --version.');
  }

  process.exit(1);
}

function collectInstallerCandidates(dirPath) {
  const candidates = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || !fs.existsSync(current)) {
      continue;
    }

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);

      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }

      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== '.exe') {
        continue;
      }

      candidates.push(absolutePath);
    }
  }

  return candidates;
}

fs.mkdirSync(finalOutputDir, { recursive: true });
ensureDesktopBuildPrerequisites();

const command = 'npx tauri build --config apps/desktop/src-tauri/tauri.conf.json --bundles nsis';
console.log('[dist:win] Building Tauri NSIS installer...');

try {
  execSync(command, { stdio: 'inherit' });

  const installers = collectInstallerCandidates(nsisOutputDir).sort((a, b) => {
    const aStat = fs.statSync(a);
    const bStat = fs.statSync(b);
    return bStat.mtimeMs - aStat.mtimeMs;
  });

  if (installers.length === 0) {
    throw new Error(`No installer .exe found under ${nsisOutputDir}`);
  }

  const installerPath = installers[0];
  const outputInstallerPath = path.join(finalOutputDir, path.basename(installerPath));

  fs.copyFileSync(installerPath, outputInstallerPath);

  const sizeMb = (fs.statSync(outputInstallerPath).size / (1024 * 1024)).toFixed(2);
  console.log(`[dist:win] Installer copied to: ${outputInstallerPath}`);
  console.log(`[dist:win] Installer size: ${sizeMb} MB`);

  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[dist:win] Packaging failed:', message);
  process.exit(1);
}
