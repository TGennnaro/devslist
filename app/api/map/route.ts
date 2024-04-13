import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq, and, isNotNull, between, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
	try {
		const searchParams = new URL(req.url).searchParams;
		const id = searchParams.get('id');
		const xmin = searchParams.get('xmin');
		const ymin = searchParams.get('ymin');
		const xmax = searchParams.get('xmax');
		const ymax = searchParams.get('ymax');

		if (id) {
			const jobId = parseInt(id);
			if (Number.isNaN(jobId))
				return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

			const data = await db
				.select()
				.from(Jobs)
				.where(eq(Jobs.id, jobId))
				.leftJoin(Company, eq(Jobs.companyId, Company.id));

			if (data.length === 1) return NextResponse.json(data[0], { status: 200 });
			return NextResponse.json({ message: 'Job not found' }, { status: 400 });
		}

		if (!xmin || !ymin || !xmax || !ymax)
			return NextResponse.json(
				{ message: 'Missing coordinates' },
				{ status: 400 }
			);

		const xMin = parseFloat(xmin);
		const yMin = parseFloat(ymin);
		const xMax = parseFloat(xmax);
		const yMax = parseFloat(ymax);

		if (
			Number.isNaN(xMin) ||
			Number.isNaN(yMin) ||
			Number.isNaN(xMax) ||
			Number.isNaN(yMax)
		)
			return NextResponse.json(
				{ message: 'Invalid coordinates' },
				{ status: 400 }
			);

		const data = await db
			.select({
				id: Jobs.id,
				title: Jobs.jobTitle,
				x: Jobs.longitude,
				y: Jobs.latitude,
				type: sql`CASE jobs.job_type WHEN 'Full-Time' THEN 1
				WHEN 'Part-Time' THEN 2
				WHEN 'Freelance' THEN 3
				WHEN 'Internship' THEN 4
				ELSE 0
				END`,
			})
			.from(Jobs)
			.where(
				and(
					isNotNull(Jobs.address),
					isNotNull(Jobs.longitude),
					isNotNull(Jobs.latitude),
					between(Jobs.latitude, yMin, yMax),
					between(Jobs.longitude, xMin, xMax)
				)
			)
			.leftJoin(Company, eq(Jobs.companyId, Company.id));

		return NextResponse.json(data);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error });
	}
}
