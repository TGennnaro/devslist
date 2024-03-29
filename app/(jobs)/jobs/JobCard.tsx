import OptionsButton from '@/components/OptionsButton';
import { getUser } from '@/lib/server_utils';
import { dateSince } from '@/lib/utils';
import { Button } from '@nextui-org/button';
import { Card } from '@/components/ui/card';
import { CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Image } from '@nextui-org/image';
import { Skeleton } from '@nextui-org/skeleton';
import {
	Briefcase,
	Calendar,
	CalendarClock,
	ChevronRight,
	Hammer,
	List,
	MapPin,
} from 'lucide-react';
import NextLink from 'next/link';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useSession } from 'next-auth/react';

const MAX_DESC_LENGTH = 200;

const generateRatingStars = (companyRating: number) => {
	const stars = [];
	let starsLeft = companyRating;

	for (let i = 0; i < 5; i++) {
		if (starsLeft >= 1.0) {
			// First generate filled stars
			stars.push(<BsStarFill key={i} color='gold' />);
			starsLeft -= 1.0;
		} else if (starsLeft >= 0.5) {
			// Then half stars
			stars.push(<BsStarHalf key={i} color='gold' />);
			starsLeft -= 0.5;
		} else {
			// Then empty stars
			stars.push(<BsStar key={i} color='gold' />);
		}
	}

	return stars;
};

const jobTypes: { [key: string]: { color: string; label: string } } = {
	'Full-Time': {
		color:
			'text-blue-600 dark:text-blue-300 bg-blue-300/30 dark:bg-blue-600/30',
		label: 'Full Time',
	},
	'Part-Time': {
		color:
			'text-purple-600 dark:text-purple-300 bg-purple-300/30 dark:bg-purple-600/30',
		label: 'Part Time',
	},
	Internship: {
		color:
			'text-green-600 dark:text-green-300 bg-green-300/30 dark:bg-green-600/30',
		label: 'Internship',
	},
	Freelance: {
		color:
			'text-pink-600 dark:text-pink-300 bg-pink-300/30 dark:bg-pink-600/30',
		label: 'Freelance',
	},
};

export function JobCardSkeleton() {
	return (
		<Card className='w-full hover:bg-slate-100 dark:hover:bg-slate-800'>
			<CardHeader className='flex gap-3'>
				<Skeleton className='w-10 h-10 rounded-md' />
				<div className='flex flex-col gap-1'>
					<Skeleton className='w-40 h-4 rounded-md' />
					<Skeleton className='w-20 h-4 rounded-md' />
					<Skeleton className='h-4 rounded-md w-52' />
				</div>
			</CardHeader>
			<CardBody className='px-3 py-2'>
				<div className='flex flex-col gap-4'>
					<div className='flex gap-2'>
						<Skeleton className='w-24 h-6 rounded-md' />
						<Skeleton className='w-40 h-6 rounded-md' />
					</div>
					<Skeleton className='w-3/4 h-6 rounded-md' />

					<Skeleton className='w-full h-32 rounded-md' />
				</div>
			</CardBody>
			<CardFooter className='flex items-center justify-between'>
				<Skeleton className='h-10 rounded-md w-28' />
				<Skeleton className='w-24 h-6 rounded-md' />
			</CardFooter>
		</Card>
	);
}

export default function JobCard({
	id,
	userId,
	position,
	company,
	companyLogo,
	companyRating,
	postedDate,
	expirationDate,
	location,
	pay,
	jobType,
	description,
	skills,
}: {
	id: number;
	userId: number;
	position: string;
	company: string;
	companyLogo: string | null;
	companyRating: number;
	postedDate: Date;
	expirationDate: string;
	location: string | null;
	pay?: string | null;
	jobType: string;
	description: string;
	skills: string[];
}) {
	const { data } = useSession();
	return (
		<Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
			<CardHeader className='flex gap-3'>
				{companyLogo ? (
					<Image
						isBlurred
						alt='Company logo'
						height={40}
						radius='sm'
						src={companyLogo}
						width={40}
						className='object-contain aspect-square'
					/>
				) : null}
				<div className='flex flex-col'>
					<p className='text-md'>{position}</p>
					<p className='flex items-center gap-1 text-small text-default-500'>
						<NextLink href='#' className='underline'>
							{company}
						</NextLink>{' '}
						| {companyRating.toFixed(1)} {generateRatingStars(companyRating)}
					</p>
					<p className='flex items-center gap-1 text-small text-default-500'>
						<CalendarClock size={16} /> Available until {expirationDate}
					</p>
				</div>
			</CardHeader>
			<CardBody className='px-3 py-2'>
				<div className='flex flex-col gap-4'>
					<div className='flex items-center gap-4'>
						<Chip
							className={jobTypes[jobType].color}
							startContent={<Briefcase size={16} className='ml-1' />}
						>
							{jobTypes[jobType].label}
						</Chip>
						{pay ? <span className='text-light'>{pay}</span> : null}
					</div>
					<div className='flex'>
						<MapPin size={16} className='mt-1 mr-2 shrink-0' />
						<span className='text-light'>{location ?? 'Not listed'}</span>
					</div>
					<div>
						<div className='flex items-center gap-1 pt-3 font-semibold'>
							<List size={16} className='mr-2' /> Description
						</div>
						<p className='text-light'>
							{description.substring(0, MAX_DESC_LENGTH) +
								(description.length > MAX_DESC_LENGTH ? '...' : '')}
						</p>
					</div>
					{skills.length > 0 ? (
						<div>
							<div className='flex items-center gap-1 pt-3 font-semibold'>
								<Hammer size={16} className='mr-2' /> Skills
							</div>
							<div className='flex flex-row items-center flex-wrap gap-1 py-2'>
								{/* Only want to display 3 skills max */}
								{(() => {
									const elements = [];
									for (let i = 0; i < skills.length && i < 3; i++) {
										elements.push(
											<Chip key={skills[i]} color='default' variant='flat'>
												{skills[i]}
											</Chip>
										);
									}
									return elements;
								})()}
							</div>
						</div>
					) : null}
				</div>
			</CardBody>
			<CardFooter className='flex items-center justify-between'>
				<Button
					as={NextLink}
					size='md'
					color='primary'
					endContent={<ChevronRight size={16} />}
					href={`/jobs/${id}`}
				>
					View Job
				</Button>
				<div className='flex items-center text-sm text-light'>
					<Calendar size={16} className='mr-1' />
					{dateSince(postedDate)}
					{userId === data?.user?.id && (
						<OptionsButton
							className='ml-4'
							options={[
								{
									label: 'Edit',
								},
								{
									label: 'Delete',
									color: 'danger',
									className: 'text-danger',
								},
							]}
						/>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
