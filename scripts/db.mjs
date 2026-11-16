// Local development PostgreSQL without Docker or a system install.
// Usage: node scripts/db.mjs start   (keeps running; Ctrl+C to stop)
// Data directory: ./.data/pg   Port: PGPORT (default 54329)
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dataDir = resolve(process.cwd(), '.data/pg');
const port = Number(process.env.PGPORT ?? 54329);
const user = process.env.PGUSER ?? 'unihub';
const password = process.env.PGPASSWORD ?? 'unihub_dev_password';
const database = process.env.PGDATABASE ?? 'unihub';

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user,
  password,
  port,
  persistent: true,
  // UTF-8 is mandatory: Windows would otherwise default to WIN1252, which cannot store Arabic text.
  initdbFlags: ['--encoding=UTF8', '--locale=C', '--lc-collate=C', '--lc-ctype=C'],
  onLog: () => {},
});

const cmd = process.argv[2] ?? 'start';
if (cmd !== 'start') {
  console.log('Stop the database with Ctrl+C in the terminal running "npm run db:start".');
  process.exit(0);
}

const fresh = !existsSync(resolve(dataDir, 'PG_VERSION'));
if (fresh) {
  console.log('[db] Initialising new cluster in', dataDir);
  await pg.initialise();
}
await pg.start();
if (fresh) {
  await pg.createDatabase(database);
  await pg.createDatabase(`${database}_test`);
}
console.log(`[db] PostgreSQL ready: postgresql://${user}:****@localhost:${port}/${database}`);

const shutdown = async () => {
  console.log('\n[db] Stopping PostgreSQL...');
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
setInterval(() => {}, 1 << 30);
