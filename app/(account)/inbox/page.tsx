import { title } from '@/components/primitives';
import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { Messages, Users } from '@/db/schema';
import Inbox from './Inbox';
import { getUser } from '@/lib/server_utils';
import Text from '@/components/Text';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Inbox',
	description: 'View your messages',
};

export default async function InboxPage() {
	const user = await getUser();
	if (user) {
		const allMessages = await db
			.select()
			.from(Messages)
			.where(eq(Messages.toId, user.id))
			.leftJoin(Users, eq(Messages.fromId, Users.id))
			.orderBy(desc(Messages.timeSent));

		const unread = allMessages.filter((m) => m.messages.isOpened === 0).length;

		return (
			<>
				<h1 className={title()}>Inbox</h1>
				<Text variant='body' className='mt-3'>
					{allMessages.length} total messages ({unread} unread)
				</Text>
				<div className='mt-5'>
					<Inbox messages={allMessages} />
				</div>
			</>
		);
	}
}
