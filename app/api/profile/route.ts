import { db } from '@/db';
import { GitHubProjects, Users } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { getUser } from '@/lib/server_utils';
import { GitHubRepo, ProfileFormEntry } from '@/types';
import { del, head, list, put } from '@vercel/blob';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const MAX_FILE_SIZE = 4718592; // 4.5 MB

const schema = z.object({
	email: z
		.string()
		.email('Invalid email address.')
		.max(100, 'Email cannot exceed 100 characters.')
		.optional(),
	firstName: z
		.string()
		.max(100, 'First name cannot exceed 100 characters.')
		.optional(),
	lastName: z
		.string()
		.max(100, 'Last name cannot exceed 100 characters.')
		.optional(),
	profilePicture: z
		.any()
		.refine((file) => file?.size <= MAX_FILE_SIZE, 'Image cannot exceed 10MB')
		.transform((file) => (file.size === 0 ? undefined : file)),
	about: z.string().max(500, 'About cannot exceed 500 characters.').optional(),
	city: z.string().max(100, 'City cannot exceed 100 characters.').optional(),
	state: z.string().max(100, 'State cannot exceed 100 characters.').optional(),
	country: z
		.string()
		.max(100, 'Country cannot exceed 100 characters.')
		.optional(),
	phoneNumber: z
		.string()
		.max(100, 'Phone number cannot exceed 100 characters.')
		.regex(/^[0-9]{3}[\-\s]?[0-9]{3}[\-\s]?[0-9]{4}$/, 'Invalid phone number.')
		.optional(),
	birthday: z
		.string()
		.regex(
			/^[0-9]{1,2}[\-\/\s][0-9]{1,2}[\-\/\s][0-9]{2}(?:[0-9]{2})?$/,
			'Invalid birthday.'
		)
		.max(10, 'Birthday cannot exceed 10 characters.')
		.optional(),
	isEmployer: z.boolean(),
	projects: z.string(),
});

async function handleBlob(
	profilePicture:
		| { size: number; type: string; name: string; lastModified: number }
		| undefined
) {
	if (profilePicture === undefined) return;
	const user = await getUser();
	if (!user) throw new Error('Unauthorized');
	if (user.picture_url !== null) {
		try {
			const currentBlob = await head(user.picture_url);
			if (
				currentBlob.pathname !== `profile-pictures/${profilePicture.name}` ||
				currentBlob.size !== profilePicture?.size
			) {
				del(currentBlob.url);
			} else {
				return;
			}
		} catch (err) {} // ignore BlobNotFoundError, picture_url gets overwritten anyway
	}
	// put new blob into Vercel
	const newBlob = await put(
		`profile-pictures/${profilePicture.name}`,
		profilePicture as FormDataEntryValue,
		{
			access: 'public',
			addRandomSuffix: false,
		}
	);
	// update the user's picture_url
	await db
		.update(Users)
		.set({ picture_url: newBlob.url })
		.where(eq(Users.id, user.id));
	console.log('Image updated');
}

export async function POST(req: NextRequest, res: Response) {
	const formData = await req.formData();
	const data: ProfileFormEntry = {
		email: formData.get('email') as string,
		firstName: formData.get('firstName') as string,
		lastName: formData.get('lastName') as string,
		profilePicture: formData.get('profilePicture') ?? undefined,
		about: formData.get('about') as string,
		city: formData.get('city') as string,
		state: formData.get('state') as string,
		country: formData.get('country') as string,
		phoneNumber: formData.get('phoneNumber') as string,
		birthday: formData.get('birthday') as string,
		isEmployer: formData.get('employer') === 'true',
		projects: formData.get('projects') as string,
	};
	for (const [k, v] of Object.entries(data)) {
		if (v === '' || v === null) {
			data[k] = undefined;
		}
	}
	try {
		const {
			email,
			firstName,
			lastName,
			profilePicture,
			about,
			city,
			state,
			country,
			phoneNumber,
			birthday,
			isEmployer,
			projects,
		} = schema.parse(data);

		const session = await getServerSession(authOptions);
		if (!session?.user.id) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
		}
		handleBlob(profilePicture);
		await db
			.update(Users)
			.set({
				email,
				firstName,
				lastName,
				phone: phoneNumber,
				about,
				city,
				state,
				country,
				dob: birthday ? new Date(birthday) : undefined,
				isEmployer,
			})
			.where(eq(Users.id, session?.user.id));

		const githubProjects: GitHubRepo[] = JSON.parse(projects);

		// Two possibilities:
		//	- User added projects, so add the new projects to DB
		// 	- User has selected projects, but removed some, so remove the removed projects from DB

		// If user removed projects, then remove from DB what is inside dbProjects but no longer in githubProjects
		const dbProjects = await db
			.select()
			.from(GitHubProjects)
			.where(eq(GitHubProjects.userId, session?.user.id));

		const dbRepoIds: number[] = [];

		dbProjects.forEach((project) => dbRepoIds.push(project.repoId));

		dbProjects.forEach(async (project) => {
			if (!githubProjects.some((p) => p.id === project.repoId))
				await db
					.delete(GitHubProjects)
					.where(eq(GitHubProjects.repoId, project.repoId));
		});

		// Add projects to DB only if they are not already in dbProjects
		githubProjects.forEach(async (project) => {
			if (!dbRepoIds.includes(project.id)) {
				await db.insert(GitHubProjects).values({
					userId: session?.user.id,
					projectName: project.name,
					githubUrl: project.html_url,
					projectDescription: project.description,
					homepageUrl: project.homepage,
					language: project.language,
					repoId: project.id,
				});
			}
		});

		// const dbRepoIds: number[] = [];
		// dbProjects.forEach((project) => dbRepoIds.push(project.repoId));

		// const gitHubProjectIds: number[] = [];
		// githubProjects.forEach((project) => gitHubProjectIds.push(project.id));

		// const difference = dbRepoIds.filter(
		// 	(repoId) => !gitHubProjectIds.includes(repoId)
		// );
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
