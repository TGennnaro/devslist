import { getCompaniesByUser } from '@/lib/models/company';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { id: number } }
) {
	const userID = params.id;
	const companies = await getCompaniesByUser(userID, true, 10);
	if (!companies) {
		return NextResponse.json(
			{ error: 'No companies found for user' },
			{ status: 404 }
		);
	}
	return NextResponse.json(companies);
}
