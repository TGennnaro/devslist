import { NextResponse } from 'next/server';
import { ProfileFormEntry } from '@/types';
import { z } from 'zod';

const MAX_FILE_SIZE = 10485760;

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
		.refine((file) => file?.size <= MAX_FILE_SIZE, 'Image cannot exceed 10MB'),
	about: z.string().max(500, 'About cannot exceed 500 characters.').optional(),
	city: z.string().max(100, 'City cannot exceed 100 characters.').optional(),
	country: z
		.string()
		.max(100, 'Country cannot exceed 100 characters.')
		.optional(),
	phoneNumber: z
		.string()
		.max(100, 'Phone number cannot exceed 100 characters.')
		.regex(/^[0-9]{3}[\-\s]?[0-9]{3}[\-\s]?[0-9]{4}$/)
		.optional(),
	birthday: z
		.string()
		.regex(/^[0-9]{1,2}[\-\/\s][0-9]{1,2}[\-\/\s][0-9]{2}(?:[0-9]{2})?$/)
		.max(10, 'Birthday cannot exceed 10 characters.')
		.optional(),
});

export async function POST(req: Request, res: Response) {
	const formData = await req.formData();
	const data: ProfileFormEntry = {
		email: formData.get('email') as string,
		firstName: formData.get('firstName') as string,
		lastName: formData.get('lastName') as string,
		profilePicture: formData.get('profilePicture') ?? undefined,
		about: formData.get('about') as string,
		city: formData.get('city') as string,
		country: formData.get('country') as string,
		phoneNumber: formData.get('phoneNumber') as string,
		birthday: formData.get('birthday') as string,
	};

	for (const [k, v] of Object.entries(data)) {
		if (v === '') {
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
			country,
			phoneNumber,
			birthday,
		} = schema.parse(data);
		console.log('Data passed');
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
