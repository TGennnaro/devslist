import { NextResponse } from 'next/server';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq, and, isNotNull } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(req: Request) {
	try {
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
					isNotNull(Jobs.latitude)
				)
			)
			.leftJoin(Company, eq(Jobs.companyId, Company.id));
		return NextResponse.json(data);
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: error });
	}
}
