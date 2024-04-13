import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';

const connection = connect({
	host: process.env.DATABASE_HOST,
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
});

export const db = drizzle(connection);

// async function run() {
// 	await migrate(db, { migrationsFolder: 'drizzle' }).catch((err) => {
// 		console.error('Migration error: ', err);
// 	});
// }

// run();
