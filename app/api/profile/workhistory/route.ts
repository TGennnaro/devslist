import { db } from '@/db';
import { Experience, GitHubProjects, Users } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { getUser } from '@/lib/server_utils';
import { ExperienceEntry, GitHubRepo, ProfileFormEntry } from '@/types';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	jobTitle: z
		.string()
		.min(3, 'Job title must be at least 3 characters.')
		.max(100, 'Job title cannot exceed 100 characters.'),
	company: z
		.string()
		.min(2, 'Company name must be at least 2 characters.')
		.max(100, 'Company name cannot exceed 100 characters.'),
	workLocation: z
		.string()
		.min(2, 'Work location must be at least 2 characters.')
		.max(100, 'Work location cannot exceed 100 characters.'),
	description: z.string().max(255, 'Description cannot exceed 255 characters.'),
	startMonth: z.string().max(2),
	startYear: z.string().max(4),
	endMonth: z.string().max(2).nullable(),
	endYear: z.string().max(4).nullable(),
});

export async function POST(req: NextRequest, res: Response) {
	const formData = await req.formData();
	const data: ExperienceEntry = {
		jobTitle: formData.get('jobTitle') as string,
		company: formData.get('company') as string,
		workLocation: formData.get('workLocation') as string,
		description: formData.get('description') as string,
		startMonth: formData.get('startMonth') as string,
		startYear: formData.get('startYear') as string,
		endMonth: formData.get('endMonth') as string,
		endYear: formData.get('endYear') as string,
	};
	try {
		const {
			jobTitle,
			company,
			workLocation,
			description,
			startMonth,
			startYear,
			endMonth,
			endYear,
		} = schema.parse(data);

		const session = await getServerSession(authOptions);
		if (!session?.user.id) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}

		const experienceEntry = await db.insert(Experience).values({
			userId: user.id,
			position: jobTitle,
			company: company,
			location: workLocation,
			description: description,
			startMonth: parseInt(startMonth),
			startYear: parseInt(startYear),
			endMonth: endMonth ? parseInt(endMonth) : null,
			endYear: endYear ? parseInt(endYear) : null,
		});

		return NextResponse.json(
			{
				message: 'OK',
				id: Number(experienceEntry.insertId),
				data: {
					userId: user.id,
					position: jobTitle,
					company: company,
					location: workLocation,
					description: description,
					startMonth: parseInt(startMonth),
					startYear: parseInt(startYear),
					endMonth: endMonth ? parseInt(endMonth) : null,
					endYear: endYear ? parseInt(endYear) : null,
				},
			},
			{ status: 200 }
		);
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.log(e.issues);
			return NextResponse.json(
				{ message: e.issues[0].message },
				{ status: 400 }
			);
		}
		if (e instanceof Error) {
			if (e.message === 'No values to set') {
				return NextResponse.json(
					{ message: 'No data was updated' },
					{ status: 400 }
				);
			}
		}
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
