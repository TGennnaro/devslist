import { db } from '@/db';
import { Message, Messages } from '@/db/schema';
import { getUser } from '@/lib/server_utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	subject: z
		.string()
		.min(3, 'Message subject must be at least 3 characters long.')
		.max(100, 'Message subject cannot exceed 100 characters.'),
	body: z
		.string()
		.min(3, 'Message body must be at least 3 characters long.')
		.max(1000, 'Message body cannot exceed 1000 characters.'),
	toId: z.number(),
	parentMessageId: z.number().nullable(),
});

export async function POST(req: Request, res: Response) {
	const formData = await req.formData();
	const data: Message = {
		subject: formData.get('subject') as string,
		body: formData.get('body') as string,
		id: 0,
		fromId: null,
		toId: Number(formData.get('toID') as string),
		isOpened: null,
		timeSent: '',
		parentMessageId: Number(formData.get('parentMessageID') as string),
	};

	const user = await getUser();
	if (!user) throw new Error('Unauthorized');

	try {
		const { subject, body, parentMessageId, toId } = schema.parse(data);

		try {
			const message = await db.insert(Messages).values({
				subject,
				body,
				fromId: user.id,
				toId,
				parentMessageId: parentMessageId ? parentMessageId : null,
				isOpened: 0,
			});

			return NextResponse.json({ message: 'OK' }, { status: 200 });
		} catch (err) {
			console.log(err);
			return NextResponse.json(
				{ message: 'Internal server error' },
				{ status: 500 }
			);
		}
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
}
