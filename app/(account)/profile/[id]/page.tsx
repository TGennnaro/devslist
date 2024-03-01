import { Avatar } from '@nextui-org/avatar';
import { CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import {
	Briefcase,
	Calculator,
	Calendar,
	ExternalLink,
	Facebook,
	Github,
	GraduationCap,
	Instagram,
	Linkedin,
	MapPin,
	Scroll,
	TextQuote,
	Twitter,
	Youtube,
	Zap,
} from 'lucide-react';
import { Button } from '@nextui-org/button';
import { db } from '@/db';
import {
	Users,
	Company,
	GitHubProjects,
	GitHubProject,
	Experience,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import NextLink from 'next/link';
import MessageButton from './MessageButton';
import { getUser } from '@/lib/server_utils';
import { getMonthNameFromNumber } from '@/lib/utils';

export default async function Page({ params }: { params: { id: number } }) {
	const user = await getUser();

	// Check if user exists
	async function checkExists() {
		const result = await db
			.select()
			.from(Users)
			.where(eq(Users.id, params.id))
			.limit(1);
		return result.length > 0;
	}

	const exists = await checkExists();

	if (exists) {
		async function fetchUser() {
			const user = await db
				.select()
				.from(Users)
				.where(eq(Users.id, params.id))
				.limit(1)
				.leftJoin(Company, eq(Users.companyId, Company.id));
			return user[0];
		}

		const userData = await fetchUser();

		async function fetchProjectsShowcase() {
			const showcase = await db
				.select()
				.from(GitHubProjects)
				.where(eq(GitHubProjects.userId, params.id));
			return showcase;
		}

		async function fetchWorkHistory() {
			const history = await db
				.select()
				.from(Experience)
				.where(eq(Experience.userId, params.id))
				.orderBy(desc(Experience.startMonth), desc(Experience.startYear));
			return history;
		}

		const projectsShowcase = await fetchProjectsShowcase();
		const workHistory = await fetchWorkHistory();

		return (
			<>
				<div className='flex flex-col items-start justify-start gap-3 mb-20 md:flex-row'>
					<div className='w-full basis-1/4'>
						<div className='flex flex-col gap-3'>
							<div>
								<Card>
									<CardBody>
										<div className='flex flex-col items-center justify-center gap-2'>
											<Avatar
												isBordered
												color='default'
												src={userData.users.picture_url ?? ''}
												showFallback
												className='h-[125px] w-[125px] md:h-[200px] md:w-[200px]'
											/>
											<div className='font-semibold md:text-3xl sm:text-2xl capitalize'>
												{(userData.users.firstName ?? 'DevsList') +
													' ' +
													(userData.users.lastName ?? 'User')}
											</div>
											{userData.users.city &&
											userData.users.state &&
											userData.users.country ? (
												<div className='font-semibold text-medium'>
													<div className='flex items-center justify-center gap-1 text-center'>
														<MapPin />
														{userData.users.city +
															', ' +
															userData.users.state +
															', ' +
															userData.users.country}
													</div>
												</div>
											) : null}
											{userData.users.isEmployer ? (
												<Chip color='secondary'>
													Recruiter @ {userData.company?.name}
												</Chip>
											) : (
												<Chip color='primary'>Developer</Chip>
											)}

											{user && userData.users.id !== user.id && (
												<MessageButton user={userData.users} />
											)}
										</div>
									</CardBody>
								</Card>
							</div>
							<div>
								<Card>
									<CardBody>
										<div className='mb-3 font-semibold md:text-3xl sm:text-2xl'>
											Socials
										</div>
										<div className='flex flex-col gap-1'>
											<Button
												color='default'
												variant='ghost'
												startContent={<Github />}
											>
												GitHub
											</Button>
											<Button
												color='primary'
												variant='ghost'
												startContent={<Facebook />}
											>
												Facebook
											</Button>
											<Button
												color='secondary'
												variant='ghost'
												startContent={<Instagram />}
											>
												Instagram
											</Button>
											<Button
												color='primary'
												variant='ghost'
												startContent={<Linkedin />}
											>
												LinkedIn
											</Button>
											<Button
												color='primary'
												variant='ghost'
												startContent={<Twitter />}
											>
												Twitter
											</Button>
											<Button
												color='danger'
												variant='ghost'
												startContent={<Youtube />}
											>
												YouTube
											</Button>
										</div>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
					<div className='basis-3/4'>
						<div className='flex flex-col gap-3'>
							{userData.users.about && (
								<Card>
									<CardHeader>
										<div className='text-3xl font-medium'>About Me</div>
									</CardHeader>
									<CardBody>{userData.users.about}</CardBody>
								</Card>
							)}
							{projectsShowcase.length > 0 && (
								<Card>
									<CardHeader>
										<div className='text-3xl font-medium'>
											Projects Showcase
										</div>
									</CardHeader>
									<CardBody>
										<div className='grid w-full gap-3 md:grid-cols-2 sm:grid-cols-1'>
											{projectsShowcase.map((project: GitHubProject) => {
												return (
													<div key={project.id}>
														<Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
															<CardHeader className='flex gap-3'>
																<div className='flex flex-row gap-3'>
																	<p className='pb-3 font-semibold text-md'>
																		{project.projectName}
																	</p>
																	{project.language && (
																		<Chip color='default' variant='faded'>
																			{project.language}
																		</Chip>
																	)}
																</div>
															</CardHeader>
															<Divider />
															<CardBody>
																<p>
																	{project.projectDescription ??
																		'No description'}
																</p>
															</CardBody>
															<Divider />
															<CardFooter>
																{project.githubUrl && (
																	<NextLink
																		href={project.githubUrl}
																		target='_BLANK'
																	>
																		<Button
																			color='default'
																			variant='ghost'
																			startContent={<Github />}
																			endContent={<ExternalLink size={15} />}
																			size='sm'
																		>
																			View repository
																		</Button>
																	</NextLink>
																)}
																{project.homepageUrl && (
																	<NextLink
																		href={project.homepageUrl}
																		target='_BLANK'
																	>
																		<Button
																			color='secondary'
																			variant='ghost'
																			startContent={<Zap />}
																			endContent={<ExternalLink size={15} />}
																			size='sm'
																		>
																			View live demo
																		</Button>
																	</NextLink>
																)}
															</CardFooter>
														</Card>
													</div>
												);
											})}
										</div>
									</CardBody>
								</Card>
							)}
							{(userData.users.skills as string[]).length > 0 && (
								<>
									<Card>
										<CardHeader>
											<div className='text-3xl font-medium'>Skills</div>
										</CardHeader>
										<CardBody>
											<div className='flex flex-row flex-wrap gap-1'>
												{(userData.users.skills as string[]).map(
													(skill: string) => {
														return (
															<Chip key={skill} color='default' variant='faded'>
																{skill}
															</Chip>
														);
													}
												)}
											</div>
										</CardBody>
									</Card>
								</>
							)}
							<Card>
								<CardHeader>
									<div className='text-3xl font-medium'>Education</div>
								</CardHeader>
								<CardBody>
									<div className='flex flex-col gap-3'>
										<div className='flex flex-row items-center gap-3'>
											<GraduationCap size={75} />
											<div className='flex flex-col gap-1'>
												<div>
													<div className='font-bold'>
														West Bumble University
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<MapPin /> Westbumble, CA
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Scroll /> Master of Science in Computer Science
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Calculator /> 3.75/4.0 GPA
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Calendar /> September 2024 - January 2025
														</div>
													</div>
												</div>
											</div>
										</div>

										<div className='flex flex-row items-center gap-3'>
											<GraduationCap size={75} />
											<div className='flex flex-col gap-1'>
												<div>
													<div className='font-bold'>
														East Bumble University
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<MapPin /> Eastbumble, CA
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Scroll /> Bachelor of Science in Computer Science
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Calculator /> 3.5/4.0 GPA
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<Calendar /> September 2020 - May 2024
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
							{workHistory.length > 0 && (
								<Card>
									<CardHeader>
										<div className='text-3xl font-medium'>Work History</div>
									</CardHeader>
									<CardBody>
										{workHistory.map((job: Experience) => (
											<div className='flex flex-col gap-3 mb-5' key={job.id}>
												<div className='flex flex-row items-center gap-3'>
													<Briefcase size={75} />
													<div className='flex flex-col gap-1'>
														<div>
															<div className='font-bold'>
																{job.position} @ {job.company}
															</div>
															<div className='text-small'>
																<div className='flex items-center gap-1'>
																	<MapPin /> {job.location}
																</div>
															</div>
															<div className='text-small'>
																<div className='flex items-center gap-1'>
																	<TextQuote /> {job.description}
																</div>
																{job.startMonth && job.startYear && (
																	<div className='text-small'>
																		<div className='flex items-center gap-1'>
																			<Calendar />{' '}
																			{getMonthNameFromNumber(job.startMonth) +
																				' ' +
																				job.startYear}{' '}
																			-{' '}
																			{job.endMonth && job.endYear
																				? getMonthNameFromNumber(job.endMonth) +
																				  ' ' +
																				  job.endYear
																				: 'Present'}
																		</div>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</CardBody>
								</Card>
							)}
						</div>
					</div>
				</div>
			</>
		);
	} else {
		return (
			<div className='flex items-center justify-center'>
				User does not exist.
			</div>
		);
	}
}
