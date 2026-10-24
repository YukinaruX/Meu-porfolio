const { spawn } = require('node:child_process');
const path = require('node:path');
const [root, port] = process.argv.slice(2);
const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1', STOCKALTO_LOCAL_DEMO: '1', API_HOST: '127.0.0.1', PORT: String(Number(port) + 1), NEXT_PUBLIC_API_URL: `http://127.0.0.1:${Number(port) + 1}`, WEB_ORIGINS: `http://127.0.0.1:${port}` };
const api = spawn(process.execPath, ['--experimental-strip-types', 'apps/api/src/server.ts'], { cwd: root, env, stdio: 'inherit', windowsHide: true });
const web = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'dev', 'apps/web', '--webpack', '--hostname', '127.0.0.1', '--port', port], { cwd: root, env, stdio: 'inherit', windowsHide: true });
for (const child of [api, web]) child.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const child of [api, web]) child.on('exit', code => { if (code) { api.kill(); web.kill(); process.exitCode = code; } });
process.on('SIGTERM', () => { api.kill(); web.kill(); });
