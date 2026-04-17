const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const tempOutputDir = path.join('release', `.tmp-${stamp}`);
const finalOutputDir = path.join('dist', 'desktop');

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

      const lower = absolutePath.toLowerCase();
      if (lower.includes('win-unpacked') || lower.includes('nsis-web')) {
        continue;
      }

      candidates.push(absolutePath);
    }
  }

  return candidates;
}

fs.mkdirSync(finalOutputDir, { recursive: true });

const command = `npx electron-builder --win nsis --x64 --config.directories.output=${JSON.stringify(tempOutputDir)}`;
console.log(`[dist:win] Building installer in temporary directory: ${tempOutputDir}`);

try {
  execSync(command, { stdio: 'inherit' });

  const installers = collectInstallerCandidates(tempOutputDir).sort((a, b) => {
    const aStat = fs.statSync(a);
    const bStat = fs.statSync(b);
    return bStat.mtimeMs - aStat.mtimeMs;
  });

  if (installers.length === 0) {
    throw new Error(`No installer .exe found under ${tempOutputDir}`);
  }

  const installerPath = installers[0];
  const outputInstallerPath = path.join(finalOutputDir, path.basename(installerPath));

  fs.copyFileSync(installerPath, outputInstallerPath);
  fs.rmSync(tempOutputDir, { recursive: true, force: true });

  const sizeMb = (fs.statSync(outputInstallerPath).size / (1024 * 1024)).toFixed(2);
  console.log(`[dist:win] Installer copied to: ${outputInstallerPath}`);
  console.log(`[dist:win] Installer size: ${sizeMb} MB`);

  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[dist:win] Packaging failed:', message);
  fs.rmSync(tempOutputDir, { recursive: true, force: true });
  process.exit(1);
}
