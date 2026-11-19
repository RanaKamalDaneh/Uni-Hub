// Starts the whole Naajah stack with one command: database -> API -> web, then opens the browser.
// Usage: npm run dev        (Ctrl+C stops everything)
import { spawn } from 'node:child_process';

const children = [];
const colors = { db: '\x1b[35m', api: '\x1b[36m', web: '\x1b[32m' };

function run(name, args, readyPattern) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', args, { shell: true, env: { ...process.env, FORCE_COLOR: '1' } });
    children.push(child);
    let ready = false;
    const onData = (buf) => {
      const text = buf.toString();
      for (const line of text.split(/\r?\n/)) if (line.trim()) console.log(`${colors[name]}[${name}]\x1b[0m ${line}`);
      if (!ready && readyPattern.test(text)) {
        ready = true;
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);
    child.on('exit', (code) => {
      if (!ready) reject(new Error(`${name} exited with code ${code} before it was ready`));
    });
  });
}

function shutdown() {
  console.log('\nStopping Naajah...');
  for (const c of children) {
    if (process.platform === 'win32') spawn('taskkill', ['/pid', String(c.pid), '/T', '/F']);
    else c.kill('SIGINT');
  }
  setTimeout(() => process.exit(0), 1500);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

try {
  await run('db', ['run', 'db:start'], /PostgreSQL ready/);
  await run('api', ['run', 'dev:api'], /listening on/);
  await run('web', ['run', 'dev:web'], /Ready in|Local:/);

  const url = 'http://localhost:3000';
  console.log(`\n\x1b[1m✔ Naajah is running: ${url}\x1b[0m  (Ctrl+C to stop)\n`);
  const opener = process.platform === 'win32' ? `start "" ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
  spawn(opener, { shell: true, stdio: 'ignore' });
} catch (e) {
  console.error(`\x1b[31m${e.message}\x1b[0m`);
  console.error('Tip: if a port is busy, Naajah may already be running in another terminal.');
  shutdown();
}
