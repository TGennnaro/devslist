'use client';
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
import NextLink from 'next/link';

export default function Inbox({
	messages,
}: {
	messages: { messages: Message; users: User | null }[];
}) {
	return (
		<>
			<Table aria-label='Inbox'>
				<TableHeader>
					<TableColumn>SUBJECT</TableColumn>
					<TableColumn>SENDER</TableColumn>
					<TableColumn>TIME</TableColumn>
				</TableHeader>
				<TableBody>
					{messages.map(
						(message: { messages: Message; users: User | null }) => (
							<TableRow key={message.messages.id}>
								<TableCell>
									<Link
										href={`/inbox/${message.messages.id}`}
										as={NextLink}
										size='sm'
										className={
											message.messages.isOpened === 0 ? 'font-bold' : ''
										}
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
									{new Date(message.messages.timeSent).toLocaleDateString()}
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
			</Table>
		</>
	);
}
