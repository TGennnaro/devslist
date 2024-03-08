import { db } from '@/db';
import { Education, Experience } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { getUser } from '@/lib/server_utils';
import { EducationEntry, ExperienceEntry } from '@/types';
import { and, eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	schoolName: z
		.string()
		.min(3, 'School name must be at least 3 characters.')
		.max(100, 'School name cannot exceed 100 characters.'),
	location: z
		.string()
		.min(2, 'Location must be at least 2 characters.')
		.max(100, 'Location cannot exceed 100 characters.'),
	degree: z
		.string()
		.min(2, 'Degree must be at least 2 characters.')
		.max(100, 'Degree cannot exceed 100 characters.'),
	gpa: z.string(),
	startMonth: z.string().max(2),
	startYear: z.string().max(4),
	endMonth: z.string().max(2).nullable(),
	endYear: z.string().max(4).nullable(),
});

export async function POST(req: NextRequest, res: Response) {
	const formData = await req.formData();
	const data: EducationEntry = {
		schoolName: formData.get('schoolName') as string,
		location: formData.get('location') as string,
		degree: formData.get('degree') as string,
		gpa: formData.get('gpa') as string,
		startMonth: formData.get('startMonth') as string,
		startYear: formData.get('startYear') as string,
		endMonth: formData.get('endMonth') as string,
		endYear: formData.get('endYear') as string,
	};
	try {
		const {
			schoolName,
			location,
			degree,
			gpa,
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

		const experienceEntry = await db.insert(Education).values({
			userId: user.id,
			schoolName: schoolName,
			location: location,
			degree: degree,
			gpa: parseFloat(gpa),
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
					schoolName: schoolName,
					location: location,
					degree: degree,
					gpa: parseFloat(gpa),
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

export async function PATCH(req: Request) {
	const searchParams = new URL(req.url).searchParams;
	let searchId = searchParams.get('id');
	if (!searchId)
		return NextResponse.json({ message: 'Missing id' }, { status: 400 });
	const id = parseInt(searchId);
	if (Number.isNaN(id))
		return NextResponse.json({ message: 'Invalid id' }, { status: 400 });

	const formData = await req.formData();
	const data: EducationEntry = {
		schoolName: formData.get('schoolName') as string,
		location: formData.get('location') as string,
		degree: formData.get('degree') as string,
		gpa: formData.get('gpa') as string,
		startMonth: formData.get('startMonth') as string,
		startYear: formData.get('startYear') as string,
		endMonth: formData.get('endMonth') as string,
		endYear: formData.get('endYear') as string,
	};
	try {
		const {
			schoolName,
			location,
			degree,
			gpa,
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

		const experienceEntry = await db
			.update(Education)
			.set({
				userId: user.id,
				schoolName: schoolName,
				degree: degree,
				gpa: parseFloat(gpa),
				location: location,
				startMonth: parseInt(startMonth),
				startYear: parseInt(startYear),
				endMonth: endMonth ? parseInt(endMonth) : null,
				endYear: endYear ? parseInt(endYear) : null,
			})
			.where(and(eq(Education.id, id), eq(Education.userId, user.id)));

		return NextResponse.json(
			{
				message: 'OK',
				id: Number(experienceEntry.insertId),
				data: {
					userId: user.id,
					schoolName: schoolName,
					degree: degree,
					gpa: gpa,
					location: location,
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

export async function DELETE(req: Request) {
	const searchParams = new URL(req.url).searchParams;
	let searchId = searchParams.get('id');
	if (!searchId)
		return NextResponse.json({ message: 'Missing id' }, { status: 400 });
	const id = parseInt(searchId);
	if (Number.isNaN(id))
		return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
	const session = await getServerSession(authOptions);
	if (!session?.user.id) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}
	const user = await getUser();
	if (!user) {
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	}

	await db
		.delete(Education)
		.where(and(eq(Education.id, id), eq(Education.userId, user.id)));

	return NextResponse.json({ message: 'OK' }, { status: 200 });
}
