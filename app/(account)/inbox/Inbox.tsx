'use client';
import { UnreadMessagesContext } from '@/app/providers';
import { Message, User } from '@/db/schema';
import { Link } from '@nextui-org/link';
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@nextui-org/table';
import Text from '@/components/Text';
import NextLink from 'next/link';
import { useContext } from 'react';

export default function Inbox({
	messages,
}: {
	messages: { messages: Message; users: Omit<User, 'password'> | null }[];
}) {
	const { unreadMessages, setUnreadMessages } = useContext(
		UnreadMessagesContext
	);

	return (
		<>
			<Text variant='body' className='my-5'>
				{messages.length} total messages ({unreadMessages} unread)
			</Text>
			<Table aria-label='Inbox'>
				<TableHeader>
					<TableColumn>SUBJECT</TableColumn>
					<TableColumn>SENDER</TableColumn>
					<TableColumn>TIME SENT</TableColumn>
				</TableHeader>
				<TableBody>
					{messages.map(
						(message: {
							messages: Message;
							users: Omit<User, 'password'> | null;
						}) => (
							<TableRow key={message.messages.id}>
								<TableCell>
									<Link
										href={`/inbox/${message.messages.id}`}
										as={NextLink}
										size='sm'
										className={
											message.messages.isOpened === 0 ? 'font-bold' : ''
										}
										onClick={() => {
											unreadMessages > 0 &&
												setUnreadMessages(unreadMessages - 1);

											message.messages.isOpened = 1;
										}}
									>
										{message.messages.subject}
									</Link>
								</TableCell>
								<TableCell>
									<Link
										href={`/profile/${message.users?.id}`}
										as={NextLink}
										size='sm'
									>
										{message.users?.firstName + ' ' + message.users?.lastName}
									</Link>
								</TableCell>
								<TableCell>
									{new Date(message.messages.timeSent).toLocaleString()}
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</>
	);
}
