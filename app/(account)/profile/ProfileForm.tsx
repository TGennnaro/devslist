'use client';

import Text from '@/components/Text';
import { Education, Experience, User } from '@/db/schema';
import { ExperienceEntry, GitHubRepo } from '@/types';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Chip } from '@nextui-org/chip';
import { Input, Textarea } from '@/components/ui/input';
import { SelectItem } from '@nextui-org/select';
import { Select } from '@/components/ui/input';
import {
	Check,
	GithubIcon,
	GraduationCap,
	Pencil,
	Plus,
	Trash,
	X,
} from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import GitHubProjects from './GitHubProjects';
import ImageUpload from './ImageUpload';
import { Switch } from '@nextui-org/switch';
import DocumentUpload from './DocumentUpload';
import { Briefcase, Calendar, MapPin, TextQuote } from 'lucide-react';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal';
import { getMonthNameFromNumber } from '@/lib/utils';
import { countries, usStates } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export default function ProfileForm({
	defaultValues,
	availableGitHubProjects,
	displayedGitHubProjects,
	workHistory,
	educationHistory,
}: {
	defaultValues: Omit<User, 'password'> | null;
	availableGitHubProjects: GitHubRepo[];
	displayedGitHubProjects: GitHubRepo[];
	workHistory: Experience[];
	educationHistory: Education[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [hasEndDate, setHasEndDate] = useState(false);
	const [history, setHistory] = useState(workHistory);
	const [selectedProjects, setSelectedProjects] = useState<GitHubRepo[]>(
		displayedGitHubProjects
	);
	const session = useSession();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const target = e.target as HTMLFormElement;
			const formData = new FormData(target as HTMLFormElement);
			formData.append('projects', JSON.stringify(selectedProjects));
			for (const checkbox of target.querySelectorAll('input[type=checkbox]')) {
				const checkboxInput = checkbox as HTMLInputElement;
				formData.set(checkboxInput.name, checkboxInput.checked.toString());
			}
			return fetch('/api/profile', {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			if (res.status === 200) {
				toast.success('Profile updated.');
			} else {
				const json = await res.json();
				if (res.status === 500) {
					toast.error('Something went wrong, try again');
				} else {
					toast.error('Error: ' + json.message);
				}
				console.error(json.message);
			}
		},
	});

	return (
		<>
			<form className='flex flex-col gap-24 mb-32' onSubmit={mutation.mutate}>
				<div className='grid grid-cols-12 gap-x-16'>
					<div className='col-span-4'>
						<span className='block mb-1 text-xl font-semibold leading-normal'>
							Profile
						</span>
						<Text variant='body' className='text-md'>
							This information will be displayed publicly on your profile.
						</Text>
					</div>
					<div className='flex flex-col col-span-8 gap-8'>
						<Switch
							name='employer'
							defaultSelected={defaultValues?.isEmployer ?? false}
							size='sm'
						>
							I am an employer
						</Switch>
						<Textarea
							name='about'
							label='About'
							labelPlacement='outside'
							placeholder='Write a few sentences about yourself'
							variant='bordered'
							radius='sm'
							minRows={4}
							defaultValue={defaultValues?.about ?? undefined}
						/>
						<div className=''>
							<Input
								name='website-1'
								label='Website'
								labelPlacement='outside'
								startContent={
									<span className='text-sm text-gray-700 dark:text-gray-400'>
										https://
									</span>
								}
								placeholder='www.example.com'
								variant='bordered'
								radius='sm'
							/>
							<Button
								startContent={<Plus className='w-4 h-4' />}
								variant='light'
								color='primary'
								className='p-0 data-[hover=true]:!bg-transparent mt-2'
								disableAnimation
							>
								Add another
							</Button>
						</div>
						<div>
							<label className='block mb-2 text-sm font-medium'>
								Profile picture
							</label>
							<ImageUpload />
						</div>
						<div>
							<label className='block mb-2 text-sm font-medium'>
								Resume/CV
							</label>
							<DocumentUpload
								name='resume'
								fileType='.pdf'
								subText='PDF up to 10MB'
							/>
						</div>
						<div>
							<div className='flex flex-row items-center gap-3 mb-5'>
								<label className='block text-sm font-medium'>
									Work experience
								</label>
								<Button
									size='sm'
									startContent={<Pencil size={16} />}
									onPress={() => router.push('/profile/experience')}
								></Button>
							</div>

							{history.length > 0 ? (
								history
									.sort((a, b) => {
										if (b.startYear !== a.startYear) {
											return b.startYear - a.startYear;
										} else {
											return b.startMonth - a.startMonth;
										}
									})
									.map((job: Experience) => (
										<div className='flex flex-col gap-3 mb-5' key={job.id}>
											<div className='flex flex-row items-center gap-3'>
												<Briefcase size={50} />
												<div className='flex flex-col gap-1'>
													<div>
														<div className='font-bold'>
															{job.position} at {job.company}
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
									))
							) : (
								<>
									<label className='block mb-2 text-sm'>
										Hey there 👋. It looks like you haven&apos;t added any work
										experience yet.
									</label>
									<label className='block mb-2 text-sm font-medium'>
										Listing your work experience is so important in helping
										potential employers get to know you better.
									</label>
								</>
							)}
						</div>
						<div>
							<div className='flex flex-row items-center gap-3 mb-5'>
								<label className='block text-sm font-medium'>
									Education history
								</label>
								<Button
									size='sm'
									startContent={<Pencil size={16} />}
									onPress={() => router.push('/profile/education')}
								></Button>
							</div>

							{educationHistory.length > 0 ? (
								educationHistory
									.sort((a, b) => {
										if (b.startYear !== a.startYear) {
											return b.startYear - a.startYear;
										} else {
											return b.startMonth - a.startMonth;
										}
									})
									.map((education: Education) => (
										<div
											className='flex flex-col gap-3 mb-5'
											key={education.id}
										>
											<div className='flex flex-row items-center gap-3'>
												<GraduationCap size={50} />
												<div className='flex flex-col gap-1'>
													<div>
														<div className='font-bold'>{education.degree}</div>
														<div className='text-small'>
															<div className='flex items-center gap-1'>
																<MapPin /> {education.location}
															</div>
														</div>
														<div className='text-small'>
															<div className='flex items-center gap-1'>
																<TextQuote /> {education.location}
															</div>
															{education.startMonth && education.startYear && (
																<div className='text-small'>
																	<div className='flex items-center gap-1'>
																		<Calendar />{' '}
																		{getMonthNameFromNumber(
																			education.startMonth
																		) +
																			' ' +
																			education.startYear}{' '}
																		-{' '}
																		{education.endMonth && education.endYear
																			? getMonthNameFromNumber(
																					education.endMonth
																			  ) +
																			  ' ' +
																			  education.endYear
																			: 'Present'}
																	</div>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									))
							) : (
								<>
									<label className='block mb-2 text-sm'>
										Hey there 👋. It looks like you haven&apos;t added any
										education history yet.
									</label>
									<label className='block mb-2 text-sm font-medium'>
										Listing your education is so important in helping potential
										employers get to know you better.
									</label>
								</>
							)}
						</div>
						<div>
							<label className='block mb-2 text-sm font-medium'>
								GitHub project showcase
							</label>
							<div className='flex flex-row items-center gap-1'>
								Status:
								<Chip
									color={!session.data?.accessToken ? 'danger' : 'success'}
									startContent={!session.data?.accessToken ? <X /> : <Check />}
									size='sm'
								>
									{!session.data?.accessToken ? 'Not linked' : 'Linked'}
								</Chip>
							</div>
							{!session.data?.accessToken ? (
								<Button
									className='bg-[rgb(36,41,47)] hover:bg-[rgb(52,60,69)] text-white transition-background rounded-md flex gap-3 py-3 mt-6'
									onClick={() => signIn('github', { callbackUrl: '/profile' })}
									startContent={<GithubIcon size={16} />}
									size='sm'
								>
									Connect to GitHub
								</Button>
							) : (
								<>
									<GitHubProjects
										displayedGitHubProjects={displayedGitHubProjects}
										availableGitHubProjects={availableGitHubProjects}
										selectedProjects={selectedProjects}
										setSelectedProjects={setSelectedProjects}
									/>
								</>
							)}
						</div>
					</div>
				</div>
				<hr className='border-divider' />
				<section className='grid grid-cols-12 gap-x-16'>
					<div className='col-span-4'>
						<span className='block mb-1 text-xl font-semibold leading-normal'>
							Personal information
						</span>
						<Text variant='body' className='text-md'>
							This information will be displayed publicly on your profile. It is
							also used to fill out your applications quicker.
						</Text>
					</div>
					<div className='flex flex-col col-span-8 gap-8'>
						<div className='grid grid-cols-2 gap-x-4'>
							<Input
								name='firstName'
								label='First name'
								labelPlacement='outside'
								placeholder='First name'
								variant='bordered'
								radius='sm'
								defaultValue={defaultValues?.firstName ?? undefined}
							/>
							<Input
								name='lastName'
								label='Last name'
								labelPlacement='outside'
								placeholder='Last name'
								variant='bordered'
								radius='sm'
								defaultValue={defaultValues?.lastName ?? undefined}
							/>
						</div>
						<Input
							name='email'
							label='Email'
							type='email'
							labelPlacement='outside'
							placeholder='Email address'
							variant='bordered'
							radius='sm'
							defaultValue={defaultValues?.email ?? undefined}
						/>
						<div className='grid grid-cols-2 gap-x-4'>
							<Input
								name='city'
								label='City'
								labelPlacement='outside'
								placeholder='City'
								variant='bordered'
								radius='sm'
								defaultValue={defaultValues?.city ?? undefined}
							/>
							<Select
								name='state'
								label='State'
								labelPlacement='outside'
								placeholder='State'
								variant='bordered'
								radius='sm'
								defaultSelectedKeys={[
									...(defaultValues?.state ? [defaultValues?.state] : []),
								]}
							>
								{usStates.map((state: string) => {
									return (
										<SelectItem key={state} value={state}>
											{state}
										</SelectItem>
									);
								})}
							</Select>
						</div>
						<div className='grid grid-cols-2 gap-x-4'>
							<Select
								name='country'
								label='Country'
								labelPlacement='outside'
								placeholder='Country'
								variant='bordered'
								radius='sm'
								selectionMode='single'
								defaultSelectedKeys={[
									...(defaultValues?.country ? [defaultValues?.country] : []),
								]}
							>
								{countries.map((country: string) => {
									return (
										<SelectItem key={country} value={country}>
											{country}
										</SelectItem>
									);
								})}
							</Select>
						</div>
						<Checkbox name='showEmail'>Show my email on my profile</Checkbox>
						<Checkbox name='showLocation'>
							Show my location on my profile
						</Checkbox>
					</div>
				</section>
				<hr className='border-divider' />
				<section className='grid grid-cols-12 gap-x-16'>
					<div className='col-span-4'>
						<span className='block mb-1 text-xl font-semibold leading-normal'>
							Private information
						</span>
						<Text variant='body' className='text-md'>
							This information is private and will not be displayed on your
							profile. It is used to fill out your applications quicker.
						</Text>
					</div>
					<div className='flex flex-col col-span-8 gap-8'>
						<div className='grid grid-cols-2 gap-x-4'>
							<Input
								name='phoneNumber'
								label='Phone number'
								labelPlacement='outside'
								placeholder='Phone number'
								variant='bordered'
								radius='sm'
								defaultValue={defaultValues?.phone ?? undefined}
							/>
							<Input
								name='birthday'
								label='Birthday'
								labelPlacement='outside'
								placeholder='Birthday'
								variant='bordered'
								radius='sm'
								defaultValue={
									defaultValues?.dob?.toLocaleDateString() ?? undefined
								}
							/>
						</div>
						<div className='grid grid-cols-6 gap-x-4'>
							<Select
								name='gender'
								label='Gender'
								labelPlacement='outside'
								placeholder='Gender'
								variant='bordered'
								radius='sm'
								// defaultSelectedKeys={...defaultValues?.gender !== null
								// 	? defaultValues?.gender === true
								// 		? ['male']
								// 		: ['female']
								// 	: []}
							>
								<SelectItem key='male' value='male'>
									Male
								</SelectItem>
								<SelectItem key='female' value='female'>
									Female
								</SelectItem>
							</Select>
							<Select
								name='veteranStatus'
								label='Veteran status'
								labelPlacement='outside'
								placeholder='Veteran status'
								variant='bordered'
								radius='sm'
								className='col-span-3'
								// defaultSelectedKeys={...defaultValues?.veteranStatus !== null
								// 	? defaultValues?.veteranStatus === true
								// 		? ['yes']
								// 		: ['no']
								// 	: []}
							>
								<SelectItem key='yes' value='yes'>
									I am a protected veteran
								</SelectItem>
								<SelectItem key='no' value='no'>
									I am not protected veteran
								</SelectItem>
							</Select>
							<Select
								name='ethnicity'
								label='Ethnicity'
								labelPlacement='outside'
								placeholder='Ethnicity'
								variant='bordered'
								radius='sm'
								className='col-span-2'
								// defaultSelectedKeys={...defaultValues?.ethnicity
								// 	? [defaultValues?.ethnicity]
								// 	: []}
							>
								<SelectItem key='white' value='white'>
									Caucasian
								</SelectItem>
								<SelectItem key='black' value='black'>
									Black/African american
								</SelectItem>
							</Select>
						</div>
						<div className='grid grid-cols-3 gap-x-4'>
							<Select
								name='disabilityStatus'
								label='Disability status'
								labelPlacement='outside'
								placeholder='Disability status'
								variant='bordered'
								radius='sm'
							>
								<SelectItem key='yes' value='yes'>
									I am disabled
								</SelectItem>
								<SelectItem key='no' value='no'>
									I am not disabled
								</SelectItem>
							</Select>
							<Input
								name='disabilityDescription'
								label='Disability'
								labelPlacement='outside'
								placeholder='Please give a brief description'
								variant='bordered'
								radius='sm'
								className='col-span-2'
								disabled
							/>
						</div>
					</div>
				</section>

				<section className='flex justify-end'>
					<Button
						color='primary'
						radius='sm'
						type='submit'
						isLoading={mutation.isLoading}
					>
						Save changes
					</Button>
				</section>
			</form>
		</>
	);
}
