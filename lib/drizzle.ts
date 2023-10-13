import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { pgTable, serial, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const db = drizzle(sql);

export const Users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		firstName: text('first_name').notNull(),
		lastName: text('last_name').notNull(),
		email: text('email').notNull().unique(),
		password: text('password').notNull(),
	},
	(users) => {
		return {
			uniqueIdx: uniqueIndex('unique_idx').on(users.email),
		};
	}
);
