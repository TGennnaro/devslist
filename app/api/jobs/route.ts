import { NextResponse } from 'next/server';
import { Job } from '@/types';
import { z } from 'zod';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq } from 'drizzle-orm';

const schema = z.object({
	jobTitle: z.string().max(100, 'Job title cannot exceed 100 characters.'),

	jobType: z.string(),

	jobResponsibilities: z.string(),

	jobDescription: z.string(),

	workAddress: z.string(),

	skills: z.string(),

	expirationDate: z.string(),

	showPayRate: z.string().optional(),

	payType: z.string().optional(),

	salary: z.string().optional(),

	hourlyRate: z.string().optional(),
});

export async function POST(req: Request, res: Response) {
	const formData = await req.formData();
	const data: Job = {
		jobTitle: formData.get('jobTitle') as string,
		jobType: formData.get('jobType') as string,
		jobResponsibilities: formData.get('jobResponsibilities') as string,
		jobDescription: formData.get('jobDescription') as string,
		workAddress: formData.get('workAddress') as string,
		skills: formData.get('skills') as string,
		expirationDate: formData.get('expirationDate') as string,
		showPayRate: (formData.get('showPayRate') as string) ?? undefined,
		payType: (formData.get('payType') as string) ?? undefined,
		salary: (formData.get('salary') as string) ?? undefined,
		hourlyRate: (formData.get('hourlyRate') as string) ?? undefined,
	};

	// for (const [k, v] of Object.entries(data)) {
	//   if (v === '') {
	//     data[k] = undefined;
	//   }
	// }

	try {
		const {
			jobTitle,
			jobType,
			jobResponsibilities,
			jobDescription,
			workAddress,
			skills,
			expirationDate,
			showPayRate,
			payType,
			salary,
			hourlyRate,
		} = schema.parse(data);
		console.log('Data passed');

		try {
			const job = await db
				.insert(Jobs)
				.values({
					jobTitle,
					userid: 7,
					companyid: 11,
					salary: 30000,
					skills,
					address: workAddress,
					jobDescription,
					jobType,
					startDate: new Date().toISOString(),
					endDate: expirationDate,
					jobRequirements: '',
					jobResponsibilities,
				})
				.returning({ insertedId: Jobs.jobid });

			return NextResponse.json(
				{ message: 'OK', id: job[0].insertedId },
				{ status: 200 }
			);
		} catch (err) {
			console.log(err);
		}
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.log(e.issues);
			return NextResponse.json({ message: e.issues[0] }, { status: 400 });
		}
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}

	return NextResponse.json({ message: 'OK' }, { status: 200 });
}

export async function GET(req: Request) {
	try {
		const data = await db
			.select()
			.from(Jobs)
			.leftJoin(Company, eq(Jobs.companyid, Company.companyid));
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
