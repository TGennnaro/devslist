import { title } from '@/components/primitives';
import { Avatar } from '@nextui-org/avatar';
import { CardBody } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { db } from '@/db';
import { Users, Messages } from '@/db/schema';
import { and, asc, desc, eq, lte, or } from 'drizzle-orm';
import { getUser } from '@/lib/server_utils';
import ReplyBox from './ReplyBox';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';

export default async function Page({ params }: { params: { id: number } }) {
	const user = await getUser();

	// Check if message exists
	async function checkExists() {
		const result = await db
			.select()
			.from(Messages)
			.where(eq(Messages.id, params.id))
			.limit(1);
		return result.length > 0;
	}

	const exists = await checkExists();

	if (exists) {
		async function fetchMessage() {
			const message = await db
				.select()
				.from(Messages)
				.where(eq(Messages.id, params.id))
				.limit(1)
				.leftJoin(Users, eq(Users.id, Messages.fromId));

			if (message[0].messages.toId === user?.id) {
				return message[0];
			} else {
				return null;
			}
		}

		const messageData = await fetchMessage();

		async function fetchMessageThread() {
			if (messageData && messageData.messages.parentMessageId) {
				// get message thread
				const messageThread = await db
					.select()
					.from(Messages)
					.where(
						and(
							or(
								eq(Messages.id, params.id),
								eq(
									Messages.parentMessageId,
									messageData.messages.parentMessageId
								),
								eq(Messages.id, messageData.messages.parentMessageId)
							)
						)
					)
					.orderBy(asc(Messages.timeSent))
					.leftJoin(Users, eq(Users.id, Messages.fromId));

				return messageThread;
			}
		}

		const messageThreadData = await fetchMessageThread();

		if (messageData) {
			if (messageData.messages.isOpened === 0) {
				await db
					.update(Messages)
					.set({ isOpened: 1 })
					.where(eq(Messages.id, params.id));
			}

			if (messageThreadData) {
				return (
					<>
						<h1 className={title()}>{messageData.messages.subject}</h1>
						{messageThreadData.map((message) => {
							return (
								<div className='mt-5' key={message.messages.id}>
									<Card>
										<CardBody>
											<div className='flex flex-row gap-5'>
												<Link
													href={`/profile/${message.users?.id}`}
													as={NextLink}
												>
													<div className='flex flex-col gap-1 items-center justify-center w-[100px]'>
														<Avatar
															isBordered
															color='default'
															src={message?.users?.picture_url ?? ''}
															showFallback
															className='h-[75px] w-[75px]'
														/>
														<div className='text-center font-semibold'>
															{message.users?.firstName +
																' ' +
																message.users?.lastName}
														</div>
													</div>
												</Link>
												<div>
													<div className='font-bold'>
														{new Date(
															message.messages.timeSent
														).toLocaleString()}
													</div>
													<div>{message.messages.body}</div>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
							);
						})}
						<div className='flex flex-col gap-3 mt-5'>
							<ReplyBox parentMessage={messageData.messages} />
						</div>
					</>
				);
			} else {
				return (
					<>
						<h1 className={title()}>{messageData.messages.subject}</h1>
						<div className='mt-5'>
							<Card>
								<CardBody>
									<div className='flex flex-row gap-5'>
										<Link
											href={`/profile/${messageData.users?.id}`}
											as={NextLink}
										>
											<div className='flex flex-col gap-1 items-center justify-center w-[100px]'>
												<Avatar
													isBordered
													color='default'
													src={messageData?.users?.picture_url ?? ''}
													showFallback
													className='h-[75px] w-[75px]'
												/>
												<div className='text-center font-semibold'>
													{messageData.users?.firstName +
														' ' +
														messageData.users?.lastName}
												</div>
											</div>
										</Link>
										<div>
											<div className='font-bold'>
												{new Date(
													messageData.messages.timeSent
												).toLocaleString()}
											</div>
											<div>{messageData.messages.body}</div>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
						<div className='flex flex-col gap-3 mt-5'>
							<ReplyBox parentMessage={messageData.messages} />
						</div>
					</>
				);
			}
		} else {
			return (
				<div className='flex items-center justify-center'>
					You do not have permission to view this message.
				</div>
			);
		}
	} else {
		return (
			<div className='flex items-center justify-center'>
				Message does not exist.
			</div>
		);
	}
}
