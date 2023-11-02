import { NextResponse } from 'next/server';
import { Job } from '@/types';
import { z } from 'zod';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const schema = z.object({
	jobTitle: z.string().max(100, 'Job title cannot exceed 100 characters.'),

	jobType: z.string(),

	jobResponsibilities: z.string(),

	jobRequirements: z.string(),

	jobDescription: z.string(),

	workAddress: z.string().optional(),

	latitude: z.string().optional(),

	longitude: z.string().optional(),

	skills: z.string(),

	expirationDate: z.string(),

	showPayRate: z.string().optional(),

	payType: z.string().optional(),

	salary: z.string().optional(),

	hourlyRate: z.string().optional(),
});

async function getCoords(fromAddress: string) {
	try {
		const response = await fetch(
			`https://geocod.xyz/api/public/getCoords?apikey=${process.env.GEOCOD_API_KEY}&postaladdress=${fromAddress}`
		);
		if (response.ok) {
			const data = await response.json();
			const latitude = data.lat;
			const longitude = data.lon;
			return [latitude, longitude];
		}
	} catch (error) {
		console.log(error);
	}

	return [null, null];
}

export async function POST(req: Request, res: Response) {
	const session = await getServerSession(authOptions);
	const formData = await req.formData();
	console.log(formData);
	const data: Job = {
		jobTitle: formData.get('jobTitle') as string,
		jobType: formData.get('jobType') as string,
		jobResponsibilities: formData.get('jobResponsibilities') as string,
		jobDescription: formData.get('jobDescription') as string,
		jobRequirements: formData.get('jobRequirements') as string,
		workAddress: (formData.get('workAddress') as string) ?? undefined,
		latitude: (formData.get('latitude') as string) ?? undefined,
		longitude: (formData.get('longitude') as string) ?? undefined,
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
			jobRequirements,
			jobDescription,
			workAddress,
			latitude,
			longitude,
			skills,
			expirationDate,
			showPayRate,
			payType,
			salary,
			hourlyRate,
		} = schema.parse(data);
		console.log('Data passed');

		try {
			// const [latitude, longitude] = await getCoords(workAddress);

			const job = await db
				.insert(Jobs)
				.values({
					jobTitle,
					userid: session?.user.id!,
					companyid: 13,
					salary: Number(salary),
					skills,
					address: workAddress,
					latitude: Number(latitude),
					longitude: Number(longitude),
					jobDescription,
					jobType,
					startDate: new Date().toISOString(),
					endDate: expirationDate,
					jobRequirements,
					jobResponsibilities,
					showPayRate: showPayRate === 'true',
					payType,
					hourlyRate: Number(hourlyRate),
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
