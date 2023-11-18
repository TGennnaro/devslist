import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { connect } from '@planetscale/database';

const connection = connect({
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(connection);

// async function run() {
// 	// @ts-ignore
// 	await migrate(db, { migrationsFolder: 'drizzle' }).catch((err) => {
// 		console.error('Migration error: ', err);
// 	});
// }

// run();
