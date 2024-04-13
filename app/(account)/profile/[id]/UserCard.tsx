import { Avatar } from '@nextui-org/avatar';
import { CardBody } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { Chip } from '@nextui-org/chip';
import { MapPin } from 'lucide-react';
import { User } from '@/db/schema';
import MessageButton from './MessageButton';

export default function UserCard({
	session,
	user,
}: {
	session: Omit<User, 'password'> | null;
	user: Omit<User, 'password'>;
}) {
	return (
		<Card>
			<CardBody className='flex flex-col items-center justify-center gap-2'>
				<Avatar
					isBordered
					color='default'
					src={user.picture_url ?? ''}
					showFallback
					className='h-[125px] w-[125px] md:h-[200px] md:w-[200px]'
				/>
				<div className='font-semibold md:text-3xl sm:text-2xl capitalize'>
					{`${user.firstName} ${user.lastName}`}
				</div>
				{user.city && user.state && user.country ? (
					<div className='flex items-center justify-center gap-1 text-center'>
						<MapPin />
						{user.city + ', ' + user.state + ', ' + user.country}
					</div>
				) : null}
				{user.isEmployer ? (
					<Chip color='secondary'>Recruiter</Chip>
				) : (
					<Chip color='primary'>Developer</Chip>
				)}

				{session && user.id !== session.id && <MessageButton id={user.id} />}
			</CardBody>
		</Card>
	);
}
