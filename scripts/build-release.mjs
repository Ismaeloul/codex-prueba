// Build only the isolated Umbrel package. Source/dependencies stay outside the store.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.resolve(process.argv[2] ?? path.join(root, 'source-build/ace-player-neo'));
const app = path.join(root, 'codex-prueba-ace-stream-neo');
const manifest = readFileSync(path.join(app, 'umbrel-app.yml'), 'utf8');
const version = /^version: "(\d+\.\d+\.\d+)"$/m.exec(manifest)?.[1];
if (!version) throw new Error('Missing package version');
const compose = readFileSync(path.join(app, 'docker-compose.yml'), 'utf8');
const containers = new Set([...compose.matchAll(/container_name:\s*([\w-]+)/g)].map((m) => m[1]));
if (!containers.size || [...containers].some((host) => !host.startsWith('codex-prueba-ace-stream-neo_')))
  throw new Error('Compose must use only the isolated test containers');
const versions = [...compose.matchAll(/\/releases\/(\d+\.\d+\.\d+)\//g)].map((m) => m[1]);
if (!versions.length || versions.some((v) => v !== version)) throw new Error('Compose/manifest version mismatch');

function assertUpstreams(file) {
  const nginx = readFileSync(file, 'utf8');
  const hosts = [...nginx.matchAll(/http:\/\/([\w-]+_\w+_1):/g)].map((m) => m[1]);
  if (!hosts.length || hosts.some((host) => !containers.has(host)))
    throw new Error('nginx points outside the test app: fix the template before packaging');
  if (!hosts.includes('codex-prueba-ace-stream-neo_storage_1') ||
      !hosts.includes('codex-prueba-ace-stream-neo_acestream_1'))
    throw new Error('Missing test app upstream');
}

assertUpstreams(path.join(source, 'deploy/umbrel/nginx.conf'));
const destination = path.join(app, 'releases', version);
if (existsSync(destination)) throw new Error('Release already exists; published versions are immutable');
execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build'], {
  cwd: path.join(source, 'apps/web'), stdio: 'inherit',
});
execFileSync(process.execPath, ['scripts/release.mjs', '--out', path.join(app, 'releases'),
  '--version', version, '--commit', '28adf272bc32ed5eeb1626c618d31d110c35b5c6-dirty'], {
  cwd: source, stdio: 'inherit',
});
assertUpstreams(path.join(destination, 'nginx.conf'));
const checksums = readFileSync(path.join(destination, 'SHA256SUMS'), 'utf8').trim().split('\n');
const listed = new Set();
for (const line of checksums) {
  const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
  if (!match) throw new Error('Invalid checksum line');
  const target = path.resolve(destination, match[2]);
  if (!target.startsWith(destination + path.sep)) throw new Error('Invalid release path');
  const hash = createHash('sha256').update(readFileSync(target)).digest('hex');
  if (hash !== match[1]) throw new Error(`Checksum mismatch: ${match[2]}`);
  listed.add(match[2]);
}
function checkFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) checkFiles(file);
    else {
      const relative = path.relative(destination, file).split(path.sep).join('/');
      if (relative !== 'SHA256SUMS' && !listed.has(relative)) throw new Error(`Unlisted file: ${relative}`);
    }
  }
}
checkFiles(destination);
console.log(`Packaged ${version}: ${checksums.length} hashes verified; all nginx upstreams belong to Codex Prueba.`);
