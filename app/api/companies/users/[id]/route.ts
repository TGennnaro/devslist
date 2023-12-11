import { getCompaniesByUser } from '@/lib/models/company';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { id: number } }
) {
	const userId = params.id;
	if (!userId) return NextResponse.json([], { status: 200 });
	const companies = await getCompaniesByUser(userId, true, 10);
	if (!companies) {
		return NextResponse.json(
			{ error: 'No companies found for user' },
			{ status: 404 }
		);
	}
	return NextResponse.json(companies);
}
