import { db } from '@/db';
import { Application, Company, Jobs } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { eq, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session?.user)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const applications = await db
		.select({
			id: Application.id,
			company: Company.name,
			position: Jobs.jobTitle,
			dateApplied: Application.created,
			lastUpdated: Application.lastModified,
			status: Application.status,
		})
		.from(Application)
		.innerJoin(Jobs, eq(Application.jobId, Jobs.id))
		.innerJoin(Company, eq(Jobs.companyId, Company.id))
		.where(eq(Application.userId, session.user.id));
	return NextResponse.json(applications, { status: 200 });
}
