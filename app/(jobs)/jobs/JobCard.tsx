import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Image } from '@nextui-org/image';
import NextLink from 'next/link';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import {
	Briefcase,
	Calendar,
	CalendarClock,
	ChevronRight,
	CircleDollarSign,
	List,
	MapPin,
} from 'lucide-react';
import { dateSince, timeSince } from '@/lib/utils';

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

export default function JobCard({
	id,
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
}: {
	id: number;
	position: string;
	company: string;
	companyLogo: string;
	companyRating: number;
	postedDate: Date;
	expirationDate: string;
	location: string | null;
	pay?: string | null;
	jobType: string;
	description: string;
}) {
	const router = useRouter();
	return (
		<Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
			<CardHeader className='flex gap-3'>
				<Image
					isBlurred
					alt='Company logo'
					height={40}
					radius='sm'
					src={companyLogo}
					width={40}
					className='object-contain p-1 dark:bg-gray-500 aspect-square'
				/>
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
						{jobType === 'Full-Time' ? (
							<Chip
								startContent={<Briefcase size={16} className='ml-1' />}
								className='text-blue-600 dark:text-blue-300 bg-blue-300/30 dark:bg-blue-600/30'
							>
								Full Time
							</Chip>
						) : jobType === 'Part-Time' ? (
							<Chip
								startContent={<Briefcase size={16} className='ml-1' />}
								className='text-purple-600 dark:text-purple-300 bg-purple-300/30 dark:bg-purple-600/30'
							>
								Part Time
							</Chip>
						) : jobType === 'Internship' ? (
							<Chip
								startContent={<Briefcase size={16} className='ml-1' />}
								className='text-green-600 dark:text-green-300 bg-green-300/30 dark:bg-green-600/30'
							>
								Internship
							</Chip>
						) : jobType === 'Freelance' ? (
							<Chip
								startContent={<Briefcase size={16} className='ml-1' />}
								className='text-pink-600 dark:text-pink-300 bg-pink-300/30 dark:bg-pink-600/30'
							>
								Freelance
							</Chip>
						) : (
							''
						)}
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
					{/* <div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcOrganization /> Company Overview
				</div>
				<p>{companyOverview}</p>
				<div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcCheckmark /> Requirements
				</div>
				<p>{requirements}</p>
				<div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcList /> Responsibilities
				</div>
				<p>{responsibilities}</p> */}
				</div>
			</CardBody>
			<CardFooter className='flex items-center justify-between'>
				<Button
					size='md'
					onClick={() => router.push(`/jobs/${id}`)}
					color='primary'
					endContent={<ChevronRight size={16} />}
				>
					View Job
				</Button>
				<div className='flex items-center text-sm text-light'>
					<Calendar size={16} className='mr-1' />
					{dateSince(postedDate)}
				</div>
			</CardFooter>
		</Card>
	);
}
