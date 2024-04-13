import { title } from '@/components/primitives';
import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { Messages, Users } from '@/db/schema';
import Inbox from './Inbox';
import { getUser } from '@/lib/server_utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Inbox',
	description: 'View your messages',
};

export default async function InboxPage() {
	const user = await getUser();
	if (user) {
		const messages = await db
			.select()
			.from(Messages)
			.where(eq(Messages.toId, user.id))
			.leftJoin(Users, eq(Messages.fromId, Users.id))
			.orderBy(desc(Messages.timeSent));

		return (
			<>
				<h1 className={title()}>Inbox</h1>
				<Inbox messages={messages} />
			</>
		);
	}

	return <div className='flex items-center justify-center'>Unauthorized</div>;
}
