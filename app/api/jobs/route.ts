import { db } from '@/db';
import { Company, Jobs } from '@/db/schema';
import { getUser } from '@/lib/server_utils';
import { Job, JobFilters } from '@/types';
import { and, desc, eq, inArray, like, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	companyId: z.number(),
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
	jobLocation: z.string().optional(),
	skills: z.string(),
	expirationDate: z.string(),
	showPayRate: z.string().optional(),
	payType: z.string().optional(),
	salary: z.string().optional(),
	hourlyRate: z.string().optional(),
});

async function getCoords(fromAddress: string | undefined) {
	if (!fromAddress) return { latitude: undefined, longitude: undefined };
	try {
		const response = await fetch(
			`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?singleLine=${fromAddress}&outFields=Match_addr,Addr_type&f=json`
		);
		if (response.ok) {
			const data = await response.json();
			if (data.candidates.length > 0) {
				const latitude = data.candidates[0].location.y;
				const longitude = data.candidates[0].location.x;
				return { latitude, longitude };
			}
		}
	} catch (error) {
		console.log(error);
	}

	return { latitude: undefined, longitude: undefined };
}

export async function POST(req: Request, res: Response) {
	const formData = await req.formData();
	const data: Job = {
		companyId: Number(formData.get('companyId')),
		jobTitle: formData.get('jobTitle') as string,
		jobType: formData.get('jobType') as string,
		jobResponsibilities: formData.get('jobResponsibilities') as string,
		jobDescription: formData.get('jobDescription') as string,
		jobRequirements: formData.get('jobRequirements') as string,
		jobLocation: (formData.get('jobLocation') as string) ?? undefined,
		skills: formData.get('skills') as string,
		expirationDate: formData.get('expirationDate') as string,
		showPayRate: (formData.get('showPayRate') as string) ?? undefined,
		payType: (formData.get('payType') as string) ?? undefined,
		salary: (formData.get('salary') as string) ?? undefined,
		hourlyRate: (formData.get('hourlyRate') as string) ?? undefined,
	};

	const user = await getUser();
	if (!user) throw new Error('Unauthorized');

	try {
		const {
			companyId,
			jobTitle,
			jobType,
			jobResponsibilities,
			jobRequirements,
			jobDescription,
			jobLocation,
			skills,
			expirationDate,
			showPayRate,
			payType,
			salary,
			hourlyRate,
		} = schema.parse(data);

		try {
			const { latitude, longitude } = await getCoords(jobLocation);

			const job = await db.insert(Jobs).values({
				jobTitle,
				userId: user.id,
				companyId,
				salary: salary ? Number(salary) : undefined,
				skills: JSON.parse(skills),
				address: jobLocation,
				latitude: latitude,
				longitude: longitude,
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
				{ message: 'OK', id: Number(job[0].insertId) },
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
			query.push(
				or(
					like(Jobs.jobTitle, `%${filters.searchQuery}%`),
					like(Jobs.jobDescription, `%${filters.searchQuery}%`),
					like(Jobs.address, `%${filters.searchQuery}%`)
				)
			);
		}
		try {
			const perPage = Number(params.get('per_page')) ?? 20;
			const data = await db
				.select()
				.from(Jobs)
				.where(and(...query))
				.leftJoin(Company, eq(Jobs.companyId, Company.id))
				.orderBy(desc(Jobs.startDate))
				.limit(perPage)
				.offset(
					Number(params.get('page')) && Number(params.get('page')) >= 0
						? (Number(params.get('page')) - 1) * perPage
						: 0
				);
			const total = await db
				.select({ count: sql`COUNT(*)` })
				.from(Jobs)
				.where(and(...query));
			return NextResponse.json({ jobs: data, total: Number(total[0].count) });
		} catch (error) {
			console.log(error);
			return NextResponse.json({ error: error });
		}
	} catch (error) {
		return NextResponse.json({ error: error });
	}
}
