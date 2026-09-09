import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getConfig } from '../lib/local-config.mjs';
import { createTargetServer } from '../lib/target-server.mjs';

const config = getConfig();
const mode = process.argv[2] ?? 'dev';
if (!['dev', 'start'].includes(mode)) throw new Error('Expected dev or start.');
const root = fileURLToPath(new URL('..', import.meta.url));
const target = createTargetServer(config);
let child;
let closing = false;
function shutdown(code = 0) {
  if (closing) return;
  closing = true;
  target.close();
  target.closeAllConnections();
  child?.kill('SIGTERM');
  process.exitCode = code;
}
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
target.on('error', (error) => {
  console.error(
    `Cannot start mock destination at ${config.targetOrigin}: ${error.message}`,
  );
  shutdown(1);
});
target.listen(config.targetPort, '127.0.0.1', () => {
  console.log(`SELU local test: ${config.siteOrigin}`);
  console.log(`Mock malicious destination: ${config.eventUrl}`);
  child = spawn(
    process.execPath,
    [
      resolve(root, 'node_modules/vinext/dist/cli.js'),
      mode,
      '--hostname',
      '127.0.0.1',
      '--port',
      String(config.sitePort),
    ],
    {
      cwd: root,
      stdio: 'inherit',
      env: {
        ...process.env,
        SITE_PORT: String(config.sitePort),
        TARGET_PORT: String(config.targetPort),
      },
    },
  );
  child.on('error', (error) => {
    console.error(error.message);
    shutdown(1);
  });
  child.on('exit', (code) => shutdown(code ?? 1));
});
