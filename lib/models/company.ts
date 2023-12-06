import { db } from '@/db';
import { Company } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getCompaniesByUser(
	userId: number,
	sorted: boolean = false,
	limit?: number
) {
	let query = db.select().from(Company).where(eq(Company.userId, userId));
	if (sorted) query = query.orderBy(Company.name);
	if (limit) query = query.limit(limit);
	return query;
}
