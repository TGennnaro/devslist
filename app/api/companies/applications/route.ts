import { db } from '@/db';
import { Application, Jobs, Users } from '@/db/schema';
import { getUTCDate } from '@/lib/utils';
import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

// TODO: Add apply cooldown (1min)

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const query = searchParams.get('id');
	if (query === null) {
		return new Response('Missing id', { status: 400 });
	}
	const id = parseInt(query);
	if (isNaN(id)) {
		return new Response('Invalid id', { status: 400 });
	}
	const applications = await db
		.select({
			id: Application.id,
			name: sql<string>`CONCAT(${Users.firstName}, ' ', ${Users.lastName})`,
			position: Jobs.jobTitle,
			dateApplied: Application.created,
			lastUpdated: Application.lastModified,
			status: Application.status,
			userId: Application.userId,
		})
		.from(Application)
		.innerJoin(Jobs, eq(Application.jobId, Jobs.id))
		.innerJoin(Users, eq(Application.userId, Users.id))
		.where(eq(Jobs.companyId, id));
	return NextResponse.json(applications, { status: 200 });
}

export async function PATCH(req: Request) {
	const searchParams = new URLSearchParams(req.url.split('?')[1]);
	const query = searchParams.get('id');
	const { prevVal, newVal } = await req.json();
	if (query === null)
		return NextResponse.json(
			{ value: prevVal, error: 'Missing application ID' },
			{ status: 400 }
		);

	const id = parseInt(query);
	if (isNaN(id))
		return NextResponse.json(
			{ value: prevVal, error: 'Invalid application ID' },
			{ status: 400 }
		);

	const application = await db
		.select()
		.from(Application)
		.where(eq(Application.id, id));

	if (application.length === 0)
		return NextResponse.json(
			{ value: prevVal, error: 'Application not found' },
			{ status: 404 }
		);

	const updated = getUTCDate();
	try {
		if (newVal === null) throw new Error('Invalid status');
		await db
			.update(Application)
			.set({ status: newVal, lastModified: updated })
			.where(eq(Application.id, id));
	} catch (e) {
		return NextResponse.json(
			{ value: prevVal, error: 'Could not update application status' },
			{ status: 500 }
		);
	}

	return NextResponse.json(
		{ value: newVal, lastModified: updated },
		{ status: 200 }
	);
}
