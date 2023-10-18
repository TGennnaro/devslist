import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

export const db = drizzle(sql);

async function run() {
	// @ts-ignore
	await migrate(db, { migrationsFolder: 'drizzle' }).catch((err) => {
		console.error('Migration error: ', err);
	});
}

run();
