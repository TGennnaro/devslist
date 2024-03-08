'use client';

import Text from '@/components/Text';
import { Experience, User } from '@/db/schema';
import { ExperienceEntry, GitHubRepo } from '@/types';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Chip } from '@nextui-org/chip';
import { Input, Textarea } from '@/components/ui/input';
import { SelectItem } from '@nextui-org/select';
import { Select } from '@/components/ui/input';
import { Check, GithubIcon, Pencil, Plus, Trash, X } from 'lucide-react';
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

export default function ProfileForm({
	defaultValues,
	availableGitHubProjects,
	displayedGitHubProjects,
	workHistory,
}: {
	defaultValues: Omit<User, 'password'> | null;
	availableGitHubProjects: GitHubRepo[];
	displayedGitHubProjects: GitHubRepo[];
	workHistory: Experience[];
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [hasEndDate, setHasEndDate] = useState(false);
	const [history, setHistory] = useState(workHistory);
	const [selectedProjects, setSelectedProjects] = useState<GitHubRepo[]>(
		displayedGitHubProjects
	);
	const session = useSession();

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

	const workHistoryMutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const target = e.target as HTMLFormElement;
			const formData = new FormData(target as HTMLFormElement);
			return fetch('/api/profile/workhistory', {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			if (res.status === 200) {
				const json = await res.json();
				toast.success('Work experience added!');
				setHasEndDate(false);
				console.log(json);
				setIsOpen(false);
				const newHistoryItem: Experience = {
					userId: 0,
					position: json.data.position,
					company: json.data.company,
					location: json.data.location,
					description: json.data.description,
					startMonth: json.data.startMonth,
					startYear: json.data.startYear,
					endMonth: json.data.endMonth,
					endYear: json.data.endYear,
					id: json.id,
				};
				setHistory([...history, newHistoryItem]);
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
									Work history
								</label>
								<Button
									size='sm'
									startContent={<Plus size={16} />}
									onPress={() => setIsOpen(true)}
								>
									Add new
								</Button>
							</div>

							{history
								.sort(
									(a, b) =>
										b.startYear - a.startYear || b.startMonth - a.startMonth
								)
								.map((job: Experience) => (
									<div className='flex flex-col gap-3 mb-5' key={job.id}>
										<div className='flex flex-row items-center gap-3'>
											<Briefcase size={50} />
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
														<div className='flex items-center mt-3 gap-1'>
															<Button
																size='sm'
																startContent={<Pencil size={16} />}
															>
																Modify
															</Button>
															<Button
																size='sm'
																color='danger'
																startContent={<Trash size={16} />}
															>
																Remove
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
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

			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Add work history</ModalHeader>
							<form onSubmit={workHistoryMutation.mutate}>
								<ModalBody>
									<div className='flex flex-col gap-1'>
										<Input
											type='text'
											name='jobTitle'
											label='Job title'
											size='sm'
											isRequired
										/>
										<Input
											type='text'
											name='company'
											label='Company'
											size='sm'
											isRequired
										/>
										<Input
											name='workLocation'
											label='Location'
											variant='bordered'
											radius='sm'
											size='sm'
											isRequired
										/>
										<Input
											name='description'
											label='Description'
											placeholder='Please give a brief description'
											variant='bordered'
											radius='sm'
											size='sm'
											isRequired
										/>
										<div className='flex gap-1 items-center'>
											<Select
												name='startMonth'
												label='Start Month'
												variant='bordered'
												radius='sm'
												isRequired
												size='sm'
											>
												<SelectItem key='1' value='1'>
													January
												</SelectItem>
												<SelectItem key='2' value='2'>
													February
												</SelectItem>
												<SelectItem key='3' value='3'>
													March
												</SelectItem>
												<SelectItem key='4' value='4'>
													April
												</SelectItem>
												<SelectItem key='5' value='5'>
													May
												</SelectItem>
												<SelectItem key='6' value='6'>
													June
												</SelectItem>
												<SelectItem key='7' value='7'>
													July
												</SelectItem>
												<SelectItem key='8' value='8'>
													August
												</SelectItem>
												<SelectItem key='9' value='9'>
													September
												</SelectItem>
												<SelectItem key='10' value='10'>
													October
												</SelectItem>
												<SelectItem key='11' value='11'>
													November
												</SelectItem>
												<SelectItem key='12' value='12'>
													December
												</SelectItem>
											</Select>

											<Select
												name='startYear'
												label='Start Year'
												variant='bordered'
												radius='sm'
												size='sm'
												isRequired
											>
												{Array.from(
													{ length: 100 },
													(_, index) => new Date().getFullYear() - index
												).map((year) => (
													<SelectItem
														key={year.toString()}
														value={year.toString()}
													>
														{year.toString()}
													</SelectItem>
												))}
											</Select>
										</div>

										{!hasEndDate && (
											<div className='flex gap-1 items-center'>
												<Select
													name='endMonth'
													label='End Month'
													variant='bordered'
													radius='sm'
													size='sm'
													isRequired
												>
													<SelectItem key='1' value='1'>
														January
													</SelectItem>
													<SelectItem key='2' value='2'>
														February
													</SelectItem>
													<SelectItem key='3' value='3'>
														March
													</SelectItem>
													<SelectItem key='4' value='4'>
														April
													</SelectItem>
													<SelectItem key='5' value='5'>
														May
													</SelectItem>
													<SelectItem key='6' value='6'>
														June
													</SelectItem>
													<SelectItem key='7' value='7'>
														July
													</SelectItem>
													<SelectItem key='8' value='8'>
														August
													</SelectItem>
													<SelectItem key='9' value='9'>
														September
													</SelectItem>
													<SelectItem key='10' value='10'>
														October
													</SelectItem>
													<SelectItem key='11' value='11'>
														November
													</SelectItem>
													<SelectItem key='12' value='12'>
														December
													</SelectItem>
												</Select>
												<Select
													name='endYear'
													label='End Year'
													variant='bordered'
													radius='sm'
													size='sm'
													isRequired
												>
													{Array.from(
														{ length: 100 },
														(_, index) => new Date().getFullYear() - index
													).map((year) => (
														<SelectItem
															key={year.toString()}
															value={year.toString()}
														>
															{year.toString()}
														</SelectItem>
													))}
												</Select>
											</div>
										)}

										<Checkbox
											name='present'
											value='false'
											onValueChange={(value) => setHasEndDate(value)}
										>
											I am presently working here
										</Checkbox>
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color='danger' variant='light' onPress={onClose}>
										Cancel
									</Button>
									<Button
										color='primary'
										type='submit'
										isDisabled={workHistoryMutation.isLoading}
										isLoading={workHistoryMutation.isLoading}
									>
										Add
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
