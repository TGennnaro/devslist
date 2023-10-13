import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const schema = z.object({
	email: z
		.string()
		.email('Invalid email address.')
		.max(100, 'Email cannot exceed 100 characters.'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters.')
		.max(100, 'Password cannot exceed 100 characters.'),
});

export async function POST(req: Request, res: Response) {
	const json = await req.json();
	console.log('Received post');
	return NextResponse.json({ message: 'Received post' }, { status: 500 });
	// try {
	// 	const { email, password } = schema.parse(json);
	// 	const hashedPassword = await bcrypt.hash(password, 10);
	// 	console.log(hashedPassword);
	// } catch (error) {
	// 	if (error instanceof z.ZodError) {
	// 		return NextResponse.json(
	// 			{ error: error.issues[0].message },
	// 			{ status: 400 }
	// 		);
	// 	} else if (error instanceof Error) {
	// 		return NextResponse.json({ error: error.message }, { status: 500 });
	// 	}
	// 	return NextResponse.json(
	// 		{ error: 'An internal error occurred.' },
	// 		{ status: 500 }
	// 	);
	// }
}
