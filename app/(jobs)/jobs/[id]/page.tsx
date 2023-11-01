import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import {
	Briefcase,
	CalendarClock,
	CircleDollarSign,
	MapPin,
	Send,
} from 'lucide-react';
import { Button } from '@nextui-org/button';
import Text from '@/components/Text';
import { Image } from '@nextui-org/image';
import { Metadata } from 'next';
import { User } from '@nextui-org/user';
import { db } from '@/db';
import { Jobs, Company } from '@/db/schema';
import { eq } from 'drizzle-orm';

const metadata: Metadata = {
	title: 'Job Posting',
	description: 'Find your next job',
};

export default async function Page({ params }: { params: { id: number } }) {
	// Check if job exists
	async function checkExists() {
		const result = await db
			.select()
			.from(Jobs)
			.where(eq(Jobs.jobid, params.id))
			.limit(1);
		return result.length > 0;
	}

	const exists = await checkExists();

	if (exists) {
		async function fetchJob() {
			const job = await db
				.select()
				.from(Jobs)
				.where(eq(Jobs.jobid, params.id))
				.limit(1)
				.leftJoin(Company, eq(Jobs.companyid, Company.companyid));
			return job[0];
		}

		const jobData = await fetchJob();

		return (
			<>
				<div className='flex flex-row gap-5 mb-8 items-center'>
					<div>
						<Image
							isBlurred
							alt='Company logo'
							height={40}
							radius='sm'
							src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png'
							width={40}
							className=' p-0.5 dark:bg-gray-500'
						/>
					</div>
					<div>
						<div className='text-3xl font-bold'>{jobData.jobs.jobTitle}</div>
						<div className='text-medium font-semibold'>
							{jobData.company?.name}
						</div>
					</div>
					<div>
						<Button endContent={<Send />} variant='solid' color='primary'>
							Apply Now
						</Button>
					</div>
				</div>

				<div className='flex flex-col md:flex-row gap-5'>
					<div className='basis-1/3'>
						<div className='flex flex-col gap-3'>
							<div>
								<div className='text-2xl font-semibold'>Availability</div>
								<Text variant='body'>
									<div className='flex items-center gap-1'>
										<CalendarClock />{' '}
										{new Date(jobData.jobs.startDate).toLocaleDateString()} -{' '}
										{new Date(jobData.jobs.endDate).toLocaleDateString()}
									</div>
								</Text>
							</div>
							<Divider />
							<div>
								<div className='text-2xl font-semibold'>Location</div>
								<Text variant='body'>
									<div className='flex items-center gap-1'>
										<MapPin /> {jobData.jobs.address}
									</div>
								</Text>
							</div>
							{jobData.jobs.showPayRate ? (
								<>
									<Divider />
									<div>
										<div className='text-2xl font-semibold'>Pay</div>
										<Text variant='body'>
											<div className='flex items-center gap-1'>
												<CircleDollarSign />
												{jobData.jobs.salary
													? '$' + jobData.jobs.salary + '/yr'
													: '$' + jobData.jobs.hourlyRate + '/hr'}
											</div>
										</Text>
									</div>
								</>
							) : null}
							<Divider />
							<div className='text-2xl font-semibold'>Job Type</div>
							<div>
								{jobData.jobs.jobType === 'Full-Time' ? (
									<Chip startContent={<Briefcase />} color='primary'>
										Full Time
									</Chip>
								) : jobData.jobs.jobType === 'Part-Time' ? (
									<Chip startContent={<Briefcase />} color='secondary'>
										Part Time
									</Chip>
								) : jobData.jobs.jobType === 'Internship' ? (
									<Chip startContent={<Briefcase />} color='success'>
										Internship
									</Chip>
								) : jobData.jobs.jobType === 'Freelance' ? (
									<Chip startContent={<Briefcase />} color='warning'>
										Freelance
									</Chip>
								) : (
									''
								)}
							</div>
							<Divider />
							<div className='text-2xl font-semibold'>Recruiter</div>
							<div>
								<User
									name='D.B. Cooper'
									description='Recruiter @ Apple, Inc.'
									avatarProps={{
										src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
									}}
								/>
							</div>
						</div>
					</div>
					<div className='basis-2/3'>
						<div className='flex flex-col gap-3'>
							<div>
								<div className='text-2xl font-semibold'>Company Overview</div>
								<Text variant='body'>placeholder</Text>
							</div>
							<div>
								<div className='text-2xl font-semibold'>Description</div>
								<Text variant='body'>{jobData.jobs.jobDescription}</Text>
							</div>
							<div>
								<div className='text-2xl font-semibold'>Requirements</div>
								<Text variant='body'>{jobData.jobs.jobRequirements}</Text>
							</div>
							<div>
								<div className='text-2xl font-semibold'>Skills</div>
								<div className='flex flex-row items-center gap-1'>
									{(jobData.jobs.skills as string[]).map((skill: any) => {
										return (
											<Chip key={skill} color='default' variant='faded'>
												{skill}
											</Chip>
										);
									})}
								</div>
							</div>
							<div>
								<div className='text-2xl font-semibold'>Responsibilities</div>
								<Text variant='body'>{jobData.jobs.jobResponsibilities}</Text>
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
