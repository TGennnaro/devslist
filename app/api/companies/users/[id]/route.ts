import { getCompaniesByUser } from '@/lib/models/company';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { id: number } }
) {
	const url = new URL(req.url);
	const searchParams = url.searchParams;
	const userId = params.id;
	const isPaginated = searchParams.get('page') ? true : false;
	if (!userId) return NextResponse.json([], { status: 200 });
	const companies = await getCompaniesByUser(
		userId,
		true,
		isPaginated,
		parseInt(searchParams.get('page') ?? '1')
	);
	if (!companies.results) {
		return NextResponse.json(
			{ error: 'No companies found for user' },
			{ status: 404 }
		);
	}
	return NextResponse.json(companies);
}
