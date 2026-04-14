const { execSync } = require('node:child_process');
const path = require('node:path');

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputDir = path.join('release', stamp);
console.log(`[dist:win] Using output directory: ${outputDir}`);
const command = `npx electron-builder --win --config.directories.output=${outputDir}`;

try {
  execSync(command, { stdio: 'inherit' });
  process.exit(0);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error('[dist:win] Packaging failed:', message);
  process.exit(1);
}
