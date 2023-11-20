import { NextResponse } from 'next/server';
import { Job, JobFilters } from '@/types';
import { z } from 'zod';
import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Company } from '@/db/schema';
import { eq, desc, inArray, and, sql, ilike } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUser } from '@/lib/server_utils';

const schema = z.object({
	jobTitle: z
		.string()
		.min(5, 'Job title must be at least 5 characters long.')
		.max(100, 'Job title cannot exceed 100 characters.'),
	jobType: z.enum(['Full-Time', 'Part-Time', 'Internship', 'Freelance'], {
		errorMap: (issue, ctx) => ({ message: 'Job type must be selected.' }),
	}),
	jobDescription: z.string().min(1, 'Job description needs to be specified.'),
	jobRequirements: z.string().min(1, 'Job requirements need to be specified.'),
	jobResponsibilities: z
		.string()
		.min(1, 'Job responsibilities need to be specified.'),
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

	const user = await getUser();
	if (!user) throw new Error('Unauthorized');

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

			const job = await db.insert(Jobs).values({
				jobTitle,
				userId: user.id,
				companyId: 1, // placeholder company ID
				salary: salary ? Number(salary) : undefined,
				skills: JSON.parse(skills),
				address: workAddress,
				latitude: latitude ? Number(latitude) : undefined,
				longitude: longitude ? Number(longitude) : undefined,
				jobDescription,
				jobType,
				endDate: new Date(expirationDate),
				jobRequirements,
				jobResponsibilities,
				showPayRate: showPayRate === 'true',
				payType,
				hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
			});

			return NextResponse.json(
				{ message: 'OK', id: Number(job.insertId) },
				{ status: 200 }
			);
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{ message: 'Internal server error' },
				{ status: 500 }
			);
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
}

export async function GET(req: Request) {
	const params = new URLSearchParams(req.url.split('?')[1]);
	const filters: JobFilters = {
		searchQuery: params.get('searchQuery') ?? undefined,
		jobTypes: params.get('jobTypes')?.split(',') ?? undefined,
	};
	try {
		const query = [];
		if (filters.jobTypes !== undefined && filters.jobTypes.length > 0) {
			query.push(inArray(Jobs.jobType, filters.jobTypes));
		}
		if (filters.searchQuery !== undefined && filters.searchQuery.length > 0) {
			query.push(ilike(Jobs.jobTitle, `%${filters.searchQuery}%`));
		}
		const data = await db
			.select()
			.from(Jobs)
			.where(and(...query))
			.leftJoin(Company, eq(Jobs.companyId, Company.id))
			.orderBy(desc(Jobs.startDate))
			.limit(20)
			.offset(
				Number(params.get('page')) && Number(params.get('page')) >= 0
					? (Number(params.get('page')) - 1) * 20
					: 0
			);
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
