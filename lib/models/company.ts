import { db } from '@/db';
import { Company } from '@/db/schema';
import { eq, count } from 'drizzle-orm';

export async function getCompaniesByUser(
	userId: number,
	sorted: boolean = false,
	page: number = 0
) {
	const LIMIT = 10;
	// only use orderBy if sorted is true
	let query = db
		.select()
		.from(Company)
		.where(eq(Company.userId, userId))
		.offset((page - 1) * LIMIT)
		.limit(LIMIT);
	if (sorted) query.orderBy(Company.name);
	let total = db
		.select({
			count: count(),
		})
		.from(Company)
		.where(eq(Company.userId, userId));
	return { total: (await total)[0].count, results: await query, limit: LIMIT };
}
