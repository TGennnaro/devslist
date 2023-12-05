import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
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
	UserPlus,
	Youtube,
	Zap,
} from 'lucide-react';
import { Button } from '@nextui-org/button';
import { db } from '@/db';
import { Users, Company, GitHubProjects, GitHubProject } from '@/db/schema';
import { eq } from 'drizzle-orm';
import NextLink from 'next/link';

export default async function Page({ params }: { params: { id: number } }) {
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

		const projectsShowcase = await fetchProjectsShowcase();

		return (
			<>
				<div className='flex flex-col md:flex-row items-start justify-start gap-3 mb-20'>
					<div className='basis-1/4 w-full'>
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
											<div className='md:text-3xl sm:text-2xl font-semibold'>
												{(userData.users.firstName ?? 'DevsList') +
													' ' +
													(userData.users.lastName ?? 'User')}
											</div>
											{userData.users.city &&
											userData.users.state &&
											userData.users.country ? (
												<div className='md:text-xl sm:text-medium font-semibold'>
													<div className='flex items-center justify-center gap-1'>
														<MapPin />{' '}
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
											<Button
												color='default'
												variant='solid'
												startContent={<UserPlus />}
												size='sm'
											>
												Connect
											</Button>
										</div>
									</CardBody>
								</Card>
							</div>
							<div>
								<Card>
									<CardBody>
										<div className='md:text-3xl sm:text-2xl font-semibold mb-3'>
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
							<Card>
								<CardHeader>
									<div className='text-3xl font-medium'>About Me</div>
								</CardHeader>
								<CardBody>{userData.users.about}</CardBody>
							</Card>
							{projectsShowcase.length > 0 ? (
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
																	<p className='text-md font-semibold pb-3'>
																		{project.projectName}
																	</p>
																	{project.language ? (
																		<Chip color='default' variant='faded'>
																			{project.language}
																		</Chip>
																	) : null}
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
																{project.githubUrl ? (
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
																) : null}
																{project.homepageUrl ? (
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
																) : null}
															</CardFooter>
														</Card>
													</div>
												);
											})}
										</div>
									</CardBody>
								</Card>
							) : null}
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
							<Card>
								<CardHeader>
									<div className='text-3xl font-medium'>Education</div>
								</CardHeader>
								<CardBody>
									<div className='flex flex-col gap-3'>
										<div className='flex flex-row gap-3 items-center'>
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

										<div className='flex flex-row gap-3 items-center'>
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
							<Card>
								<CardHeader>
									<div className='text-3xl font-medium'>Work History</div>
								</CardHeader>
								<CardBody>
									<div className='flex flex-col gap-3'>
										<div className='flex flex-row gap-3 items-center'>
											<Briefcase size={75} />
											<div className='flex flex-col gap-1'>
												<div>
													<div className='font-bold'>
														Search Engineer @ Google
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<MapPin /> Mountain View, CA
														</div>
													</div>
													<div className='text-small'>
														<div className='flex items-center gap-1'>
															<TextQuote /> Developed AI-enhanced algorithms to
															improve search engine results
														</div>
														<div className='text-small'>
															<div className='flex items-center gap-1'>
																<Calendar /> September 2022 - May 2023
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</CardBody>
							</Card>
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
