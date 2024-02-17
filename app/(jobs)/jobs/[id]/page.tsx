import Text from '@/components/Text';
import { db } from '@/db';
import { Company, Jobs, Users } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Image } from '@nextui-org/image';
import { Link } from '@nextui-org/link';
import { User } from '@nextui-org/user';
import { eq } from 'drizzle-orm';
import {
	Briefcase,
	CalendarClock,
	ChevronLeft,
	MapPin,
	Send,
} from 'lucide-react';
import { Metadata } from 'next';
import { toast } from 'sonner';
import ApplyButton from './ApplyButton';

export const metadata: Metadata = {
	title: 'Job Posting',
	description: 'Find your next job',
};

export default async function Page({ params }: { params: { id: number } }) {
	// Check if job exists
	async function checkExists() {
		const result = await db
			.select()
			.from(Jobs)
			.where(eq(Jobs.id, params.id))
			.limit(1);
		return result.length > 0;
	}

	const exists = await checkExists();

	if (exists) {
		async function fetchJob() {
			const job = await db
				.select()
				.from(Jobs)
				.where(eq(Jobs.id, params.id))
				.limit(1)
				.leftJoin(Company, eq(Jobs.companyId, Company.id))
				.leftJoin(Users, eq(Jobs.userId, Users.id));
			return job[0];
		}

		const jobData = await fetchJob();

		return (
			<>
				<Link href='/jobs' color='primary' className='py-2 mb-8 cursor-pointer'>
					<ChevronLeft size={16} className='mr-2' />
					Go back
				</Link>
				<div className='flex flex-row items-center justify-between mb-8'>
					<div className='flex items-center gap-4'>
						{jobData.company?.logo ? (
							<Image
								isBlurred
								alt='Company logo'
								width={64}
								height={64}
								radius='sm'
								src={jobData.company.logo}
								className='object-contain p-1 aspect-square'
							/>
						) : null}
						<div>
							<div className='text-3xl font-bold'>{jobData.jobs.jobTitle}</div>
							<div className='font-semibold text-medium text-light'>
								{jobData.company?.name}
							</div>
						</div>
					</div>
					<ApplyButton id={jobData.jobs.id} />
				</div>

				<div className='flex flex-col gap-5 md:flex-row'>
					<div className='basis-1/3'>
						<div className='flex flex-col gap-3'>
							<div className='text-xl font-semibold'>Information</div>
							<div className='flex items-center'>
								<CalendarClock size={16} className='mr-2' />
								<span className='text-light'>
									Available{' '}
									{new Date(jobData.jobs.startDate).toLocaleDateString()} -{' '}
									{new Date(jobData.jobs.endDate).toLocaleDateString()}
								</span>
							</div>
							<div className='flex'>
								<MapPin size={16} className='mt-1 mr-2 shrink-0' />
								<span className='text-light'>
									{jobData.jobs.address ?? 'Not listed'}
								</span>
							</div>
							<div className='flex items-center gap-4'>
								{jobData.jobs.jobType === 'Full-Time' ? (
									<Chip
										startContent={<Briefcase size={16} className='ml-1' />}
										className='text-blue-600 dark:text-blue-300 bg-blue-300/30 dark:bg-blue-600/30'
									>
										Full Time
									</Chip>
								) : jobData.jobs.jobType === 'Part-Time' ? (
									<Chip
										startContent={<Briefcase size={16} className='ml-1' />}
										className='text-purple-600 dark:text-purple-300 bg-purple-300/30 dark:bg-purple-600/30'
									>
										Part Time
									</Chip>
								) : jobData.jobs.jobType === 'Internship' ? (
									<Chip
										startContent={<Briefcase size={16} className='ml-1' />}
										className='text-green-600 dark:text-green-300 bg-green-300/30 dark:bg-green-600/30'
									>
										Internship
									</Chip>
								) : jobData.jobs.jobType === 'Freelance' ? (
									<Chip
										startContent={<Briefcase size={16} className='ml-1' />}
										className='text-pink-600 dark:text-pink-300 bg-pink-300/30 dark:bg-pink-600/30'
									>
										Freelance
									</Chip>
								) : (
									''
								)}
								<span className='text-light'>
									{jobData.jobs.showPayRate
										? jobData.jobs.salary
											? '$' + jobData.jobs.salary + '/year'
											: '$' + jobData.jobs.hourlyRate + '/hour'
										: null}
								</span>
							</div>
							<Divider />
							<div className='text-xl font-semibold'>Recruiter</div>
							<div>
								<User
									name={
										jobData.users?.firstName + ' ' + jobData.users?.lastName
									}
									description={jobData.company?.name}
									avatarProps={{
										src: jobData.users?.picture_url ?? '',
									}}
								/>
							</div>
						</div>
					</div>
					<div className='basis-2/3'>
						<div className='flex flex-col gap-6'>
							<div>
								<div className='mb-2 text-xl font-medium'>Company Overview</div>
								<Text variant='body'>{jobData.company?.description}</Text>
							</div>
							<div>
								<div className='mb-2 text-xl font-medium'>Description</div>
								<Text variant='body'>{jobData.jobs.jobDescription}</Text>
							</div>
							<div>
								<div className='mb-2 text-xl font-medium'>Requirements</div>
								<Text variant='body'>{jobData.jobs.jobRequirements}</Text>
							</div>
							<div>
								<div className='mb-2 text-xl font-medium'>Responsibilities</div>
								<Text variant='body'>{jobData.jobs.jobResponsibilities}</Text>
							</div>
							<div>
								<div className='mb-2 text-xl font-medium'>Skills</div>
								<div className='flex flex-row flex-wrap items-center gap-1 py-2'>
									{(jobData.jobs.skills as string[]).map((skill: string) => {
										return (
											<Chip key={skill} color='default' variant='flat'>
												{skill}
											</Chip>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	} else {
		return (
			<div className='flex items-center justify-center'>
				Job posting does not exist.
			</div>
		);
	}
}
