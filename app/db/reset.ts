import { existsSync, rmSync } from 'node:fs';

const url = process.env.DATABASE_URL ?? 'local.db';

for (const suffix of ['', '-shm', '-wal']) {
    const file = `${url}${suffix}`;

    if (existsSync(file)) {
        rmSync(file);
    }
}

console.log(`Removed ${url}`);
