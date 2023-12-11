import { db } from '@/db';
import { Company } from '@/db/schema';
import { getUser } from '@/lib/server_utils';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	companyName: z.string().min(3).max(50),
	companyDescription: z.string().min(3).max(500),
	companyAddress: z.string().min(3).max(80),
	companyUrl: z.string().url(),
	companyTerms: z.enum(['true', 'false']).transform((val) => val === 'true'),
});

export async function POST(req: Request) {
	const formData = await req.formData();
	const data = Object.fromEntries(formData.entries());
	const user = await getUser();
	if (!user)
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	try {
		const {
			companyName,
			companyDescription,
			companyAddress,
			companyUrl,
			companyTerms,
		} = schema.parse(data);
		if (!companyTerms)
			return NextResponse.json(
				{ message: 'You must agree to the terms and conditions' },
				{ status: 400 }
			);
		await db.insert(Company).values({
			name: companyName,
			description: companyDescription,
			address: companyAddress,
			url: companyUrl,
			userId: user.id,
		});
		return NextResponse.json({}, { status: 200 });
	} catch (e) {
		if (e instanceof z.ZodError) {
			console.log(e.issues);
			return NextResponse.json(
				{ message: e.issues[0].message },
				{ status: 400 }
			);
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
	await db.delete(Company).where(eq(Company.id, id));
	return NextResponse.json({}, { status: 200 });
}
