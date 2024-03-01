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
	jobTitle: z.string().max(100, 'Job title cannot exceed 100 characters.'),
	company: z.string().max(100, 'Company name cannot exceed 100 characters.'),
	workLocation: z
		.string()
		.max(100, 'Work location cannot exceed 100 characters.'),
	description: z.string().max(255, 'Description cannot exceed 255 characters.'),
	startMonth: z.string().max(2, 'Month cannot exceed 2 characters.'),
	startYear: z.string().max(4, 'Year cannot exceed 4 characters.'),
	endMonth: z.string().max(2, 'Month cannot exceed 2 characters.').nullable(),
	endYear: z.string().max(4, 'Year cannot exceed 4 characters.').nullable(),
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

		await db.insert(Experience).values({
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
	return NextResponse.json({ message: 'OK' }, { status: 200 });
}
