import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
	schema: './db/schema.ts',
	out: './drizzle',
	driver: 'mysql2',
	dbCredentials: {
		// connectionString: process.env.DATABASE_URL!,
		uri: process.env.DATABASE_URL as string,
	},
} satisfies Config;
