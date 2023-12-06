import { GeoSuggestionResult, GeocodeResult } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
	const searchParams = new URLSearchParams(req.url.split('?')[1]);
	const addressQuery = searchParams.get('query');
	if (!addressQuery)
		return NextResponse.json({ suggestions: [] }, { status: 400 });
	const res = await fetch(
		`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?maxSuggestions=6&outSR=%7B%22wkid%22%3A4326%7D&text=${addressQuery.replace(
			' ',
			'%20'
		)}&f=json`
	);
	if (!res.ok) return NextResponse.json({ suggestions: [] }, { status: 500 });
	const data: GeoSuggestionResult = await res.json();
	return NextResponse.json(data, { status: 200 });
}
