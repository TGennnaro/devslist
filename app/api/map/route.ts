import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq, and, isNotNull, between } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = false;

export async function GET(req: Request) {
	try {
		const { xmin, ymin, xmax, ymax } = Object.fromEntries(
			new URL(req.url).searchParams
		);

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
				companyId: Jobs.companyId,
				jobTitle: Jobs.jobTitle,
				showPayRate: Jobs.showPayRate,
				payType: Jobs.payType,
				hourlyRate: Jobs.hourlyRate,
				salary: Jobs.salary,
				address: Jobs.address,
				longitude: Jobs.longitude,
				latitude: Jobs.latitude,
				jobType: Jobs.jobType,
				name: Company.name,
				logo: Company.logo,
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
