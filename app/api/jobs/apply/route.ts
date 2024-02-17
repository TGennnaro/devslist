import { db } from '@/db';
import { Application } from '@/db/schema';
import { getUser } from '@/lib/server_utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const searchParams = new URL(req.url).searchParams;
	const searchId = searchParams.get('id');
	if (!searchId)
		return NextResponse.json({ message: 'Job not found' }, { status: 404 });
	const jobId = parseInt(searchId);
	if (isNaN(jobId))
		return NextResponse.json({ message: 'Invalid job id' }, { status: 400 });
	const user = await getUser();
	if (!user)
		return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
	try {
		await db.insert(Application).values({
			userId: user.id,
			jobId,
			status: 0,
		});
		return NextResponse.json({}, { status: 200 });
	} catch (e) {
		return NextResponse.json(
			{ message: 'Internal server error' },
			{ status: 500 }
		);
	}
}
