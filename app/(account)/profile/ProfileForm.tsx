'use client';

import Text from '@/components/Text';
import { Experience, User } from '@/db/schema';
import { GitHubRepo } from '@/types';
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
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
			const newHistoryItem = {
				position: formData.get('jobTitle') as string | null,
				company: formData.get('company') as string | null,
				location: formData.get('workLocation') as string | null,
				description: formData.get('description') as string | null,
				startMonth: formData.get('startMonth') as number | null,
				startYear: formData.get('startYear') as number | null,
				endMonth: formData.get('endMonth') as number | null,
				endYear: formData.get('endYear') as number | null,
				id: 0,
				userId: 0,
			};
			setHistory([...history, newHistoryItem]);
			return fetch('/api/profile/workhistory', {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res, formData) => {
			if (res.status === 200) {
				toast.success('Work experience added!');
				setHasEndDate(false);
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
								<Button size='sm' startContent={<Plus />} onPress={onOpen}>
									Add new
								</Button>
							</div>

							{history.map((job: Experience) => (
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
														<Button size='sm' startContent={<Pencil />}>
															Modify
														</Button>
														<Button
															size='sm'
															color='danger'
															startContent={<Trash />}
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
									startContent={<GithubIcon />}
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
								<SelectItem key='Alabama' value='Alabama'>
									Alabama
								</SelectItem>
								<SelectItem key='Alaska' value='Alaska'>
									Alaska
								</SelectItem>
								<SelectItem key='Arizona' value='Arizona'>
									Arizona
								</SelectItem>
								<SelectItem key='Arkansas' value='Arkansas'>
									Arkansas
								</SelectItem>
								<SelectItem key='California' value='California'>
									California
								</SelectItem>
								<SelectItem key='Colorado' value='Colorado'>
									Colorado
								</SelectItem>
								<SelectItem key='Connecticut' value='Connecticut'>
									Connecticut
								</SelectItem>
								<SelectItem key='Delaware' value='Delaware'>
									Delaware
								</SelectItem>
								<SelectItem key='Florida' value='Florida'>
									Florida
								</SelectItem>
								<SelectItem key='Georgia' value='Georgia'>
									Georgia
								</SelectItem>
								<SelectItem key='Hawaii' value='Hawaii'>
									Hawaii
								</SelectItem>
								<SelectItem key='Idaho' value='Idaho'>
									Idaho
								</SelectItem>
								<SelectItem key='Illinois' value='Illinois'>
									Illinois
								</SelectItem>
								<SelectItem key='Indiana' value='Indiana'>
									Indiana
								</SelectItem>
								<SelectItem key='Iowa' value='Iowa'>
									Iowa
								</SelectItem>
								<SelectItem key='Kansas' value='Kansas'>
									Kansas
								</SelectItem>
								<SelectItem key='Kentucky' value='Kentucky'>
									Kentucky
								</SelectItem>
								<SelectItem key='Louisiana' value='Louisiana'>
									Louisiana
								</SelectItem>
								<SelectItem key='Maine' value='Maine'>
									Maine
								</SelectItem>
								<SelectItem key='Maryland' value='Maryland'>
									Maryland
								</SelectItem>
								<SelectItem key='Massachusetts' value='Massachusetts'>
									Massachusetts
								</SelectItem>
								<SelectItem key='Michigan' value='Michigan'>
									Michigan
								</SelectItem>
								<SelectItem key='Minnesota' value='Minnesota'>
									Minnesota
								</SelectItem>
								<SelectItem key='Mississippi' value='Mississippi'>
									Mississippi
								</SelectItem>
								<SelectItem key='Missouri' value='Missouri'>
									Missouri
								</SelectItem>
								<SelectItem key='Montana' value='Montana'>
									Montana
								</SelectItem>
								<SelectItem key='Nebraska' value='Nebraska'>
									Nebraska
								</SelectItem>
								<SelectItem key='Nevada' value='Nevada'>
									Nevada
								</SelectItem>
								<SelectItem key='New Hampshire' value='New Hampshire'>
									New Hampshire
								</SelectItem>
								<SelectItem key='New Jersey' value='New Jersey'>
									New Jersey
								</SelectItem>
								<SelectItem key='New Mexico' value='New Mexico'>
									New Mexico
								</SelectItem>
								<SelectItem key='New York' value='New York'>
									New York
								</SelectItem>
								<SelectItem key='North Carolina' value='North Carolina'>
									North Carolina
								</SelectItem>
								<SelectItem key='North Dakota' value='North Dakota'>
									North Dakota
								</SelectItem>
								<SelectItem key='Ohio' value='Ohio'>
									Ohio
								</SelectItem>
								<SelectItem key='Oklahoma' value='Oklahoma'>
									Oklahoma
								</SelectItem>
								<SelectItem key='Oregon' value='Oregon'>
									Oregon
								</SelectItem>
								<SelectItem key='Pennsylvania' value='Pennsylvania'>
									Pennsylvania
								</SelectItem>
								<SelectItem key='Rhode Island' value='Rhode Island'>
									Rhode Island
								</SelectItem>
								<SelectItem key='South Carolina' value='South Carolina'>
									South Carolina
								</SelectItem>
								<SelectItem key='South Dakota' value='South Dakota'>
									South Dakota
								</SelectItem>
								<SelectItem key='Tennessee' value='Tennessee'>
									Tennessee
								</SelectItem>
								<SelectItem key='Texas' value='Texas'>
									Texas
								</SelectItem>
								<SelectItem key='Utah' value='Utah'>
									Utah
								</SelectItem>
								<SelectItem key='Vermont' value='Vermont'>
									Vermont
								</SelectItem>
								<SelectItem key='Virginia' value='Virginia'>
									Virginia
								</SelectItem>
								<SelectItem key='Washington' value='Washington'>
									Washington
								</SelectItem>
								<SelectItem key='West Virginia' value='West Virginia'>
									West Virginia
								</SelectItem>
								<SelectItem key='Wisconsin' value='Wisconsin'>
									Wisconsin
								</SelectItem>
								<SelectItem key='Wyoming' value='Wyoming'>
									Wyoming
								</SelectItem>
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
								<SelectItem key='Afghanistan' value='Afghanistan'>
									Afghanistan
								</SelectItem>
								<SelectItem key='Albania' value='Albania'>
									Albania
								</SelectItem>
								<SelectItem key='Algeria' value='Algeria'>
									Algeria
								</SelectItem>
								<SelectItem key='Andorra' value='Andorra'>
									Andorra
								</SelectItem>
								<SelectItem key='Angola' value='Angola'>
									Angola
								</SelectItem>
								<SelectItem
									key='Antigua and Barbuda'
									value='Antigua and Barbuda'
								>
									Antigua and Barbuda
								</SelectItem>
								<SelectItem key='Argentina' value='Argentina'>
									Argentina
								</SelectItem>
								<SelectItem key='Armenia' value='Armenia'>
									Armenia
								</SelectItem>
								<SelectItem key='Australia' value='Australia'>
									Australia
								</SelectItem>
								<SelectItem key='Austria' value='Austria'>
									Austria
								</SelectItem>
								<SelectItem key='Azerbaijan' value='Azerbaijan'>
									Azerbaijan
								</SelectItem>
								<SelectItem key='Bahamas' value='Bahamas'>
									Bahamas
								</SelectItem>
								<SelectItem key='Bahrain' value='Bahrain'>
									Bahrain
								</SelectItem>
								<SelectItem key='Bangladesh' value='Bangladesh'>
									Bangladesh
								</SelectItem>
								<SelectItem key='Barbados' value='Barbados'>
									Barbados
								</SelectItem>
								<SelectItem key='Belarus' value='Belarus'>
									Belarus
								</SelectItem>
								<SelectItem key='Belgium' value='Belgium'>
									Belgium
								</SelectItem>
								<SelectItem key='Belize' value='Belize'>
									Belize
								</SelectItem>
								<SelectItem key='Benin' value='Benin'>
									Benin
								</SelectItem>
								<SelectItem key='Bhutan' value='Bhutan'>
									Bhutan
								</SelectItem>
								<SelectItem key='Bolivia' value='Bolivia'>
									Bolivia
								</SelectItem>
								<SelectItem
									key='Bosnia and Herzegovina'
									value='Bosnia and Herzegovina'
								>
									Bosnia and Herzegovina
								</SelectItem>
								<SelectItem key='Botswana' value='Botswana'>
									Botswana
								</SelectItem>
								<SelectItem key='Brazil' value='Brazil'>
									Brazil
								</SelectItem>
								<SelectItem key='Brunei' value='Brunei'>
									Brunei
								</SelectItem>
								<SelectItem key='Bulgaria' value='Bulgaria'>
									Bulgaria
								</SelectItem>
								<SelectItem key='Burkina Faso' value='Burkina Faso'>
									Burkina Faso
								</SelectItem>
								<SelectItem key='Burundi' value='Burundi'>
									Burundi
								</SelectItem>
								<SelectItem key='Cabo Verde' value='Cabo Verde'>
									Cabo Verde
								</SelectItem>
								<SelectItem key='Cambodia' value='Cambodia'>
									Cambodia
								</SelectItem>
								<SelectItem key='Cameroon' value='Cameroon'>
									Cameroon
								</SelectItem>
								<SelectItem key='Canada' value='Canada'>
									Canada
								</SelectItem>
								<SelectItem
									key='Central African Republic'
									value='Central African Republic'
								>
									Central African Republic
								</SelectItem>
								<SelectItem key='Chad' value='Chad'>
									Chad
								</SelectItem>
								<SelectItem key='Chile' value='Chile'>
									Chile
								</SelectItem>
								<SelectItem key='China' value='China'>
									China
								</SelectItem>
								<SelectItem key='Colombia' value='Colombia'>
									Colombia
								</SelectItem>
								<SelectItem key='Comoros' value='Comoros'>
									Comoros
								</SelectItem>
								<SelectItem
									key='Congo (Congo-Brazzaville)'
									value='Congo (Congo-Brazzaville)'
								>
									Congo (Congo-Brazzaville)
								</SelectItem>
								<SelectItem key='Costa Rica' value='Costa Rica'>
									Costa Rica
								</SelectItem>
								<SelectItem key='Croatia' value='Croatia'>
									Croatia
								</SelectItem>
								<SelectItem key='Cuba' value='Cuba'>
									Cuba
								</SelectItem>
								<SelectItem key='Cyprus' value='Cyprus'>
									Cyprus
								</SelectItem>
								<SelectItem
									key='Czechia (Czech Republic)'
									value='Czechia (Czech Republic)'
								>
									Czechia (Czech Republic)
								</SelectItem>
								<SelectItem key='Denmark' value='Denmark'>
									Denmark
								</SelectItem>
								<SelectItem key='Djibouti' value='Djibouti'>
									Djibouti
								</SelectItem>
								<SelectItem key='Dominica' value='Dominica'>
									Dominica
								</SelectItem>
								<SelectItem key='Dominican Republic' value='Dominican Republic'>
									Dominican Republic
								</SelectItem>
								<SelectItem
									key='East Timor (Timor-Leste)'
									value='East Timor (Timor-Leste)'
								>
									East Timor (Timor-Leste)
								</SelectItem>
								<SelectItem key='Ecuador' value='Ecuador'>
									Ecuador
								</SelectItem>
								<SelectItem key='Egypt' value='Egypt'>
									Egypt
								</SelectItem>
								<SelectItem key='El Salvador' value='El Salvador'>
									El Salvador
								</SelectItem>
								<SelectItem key='Equatorial Guinea' value='Equatorial Guinea'>
									Equatorial Guinea
								</SelectItem>
								<SelectItem key='Eritrea' value='Eritrea'>
									Eritrea
								</SelectItem>
								<SelectItem key='Estonia' value='Estonia'>
									Estonia
								</SelectItem>
								<SelectItem key='Eswatini' value='Eswatini'>
									Eswatini
								</SelectItem>
								<SelectItem key='Ethiopia' value='Ethiopia'>
									Ethiopia
								</SelectItem>
								<SelectItem key='Fiji' value='Fiji'>
									Fiji
								</SelectItem>
								<SelectItem key='Finland' value='Finland'>
									Finland
								</SelectItem>
								<SelectItem key='France' value='France'>
									France
								</SelectItem>
								<SelectItem key='Gabon' value='Gabon'>
									Gabon
								</SelectItem>
								<SelectItem key='Gambia' value='Gambia'>
									Gambia
								</SelectItem>
								<SelectItem key='Georgia' value='Georgia'>
									Georgia
								</SelectItem>
								<SelectItem key='Germany' value='Germany'>
									Germany
								</SelectItem>
								<SelectItem key='Ghana' value='Ghana'>
									Ghana
								</SelectItem>
								<SelectItem key='Greece' value='Greece'>
									Greece
								</SelectItem>
								<SelectItem key='Grenada' value='Grenada'>
									Grenada
								</SelectItem>
								<SelectItem key='Guatemala' value='Guatemala'>
									Guatemala
								</SelectItem>
								<SelectItem key='Guinea' value='Guinea'>
									Guinea
								</SelectItem>
								<SelectItem key='Guinea-Bissau' value='Guinea-Bissau'>
									Guinea-Bissau
								</SelectItem>
								<SelectItem key='Guyana' value='Guyana'>
									Guyana
								</SelectItem>
								<SelectItem key='Haiti' value='Haiti'>
									Haiti
								</SelectItem>
								<SelectItem key='Honduras' value='Honduras'>
									Honduras
								</SelectItem>
								<SelectItem key='Hungary' value='Hungary'>
									Hungary
								</SelectItem>
								<SelectItem key='Iceland' value='Iceland'>
									Iceland
								</SelectItem>
								<SelectItem key='India' value='India'>
									India
								</SelectItem>
								<SelectItem key='Indonesia' value='Indonesia'>
									Indonesia
								</SelectItem>
								<SelectItem key='Iran' value='Iran'>
									Iran
								</SelectItem>
								<SelectItem key='Iraq' value='Iraq'>
									Iraq
								</SelectItem>
								<SelectItem key='Ireland' value='Ireland'>
									Ireland
								</SelectItem>
								<SelectItem key='Israel' value='Israel'>
									Israel
								</SelectItem>
								<SelectItem key='Italy' value='Italy'>
									Italy
								</SelectItem>
								<SelectItem key='Jamaica' value='Jamaica'>
									Jamaica
								</SelectItem>
								<SelectItem key='Japan' value='Japan'>
									Japan
								</SelectItem>
								<SelectItem key='Jordan' value='Jordan'>
									Jordan
								</SelectItem>
								<SelectItem key='Kazakhstan' value='Kazakhstan'>
									Kazakhstan
								</SelectItem>
								<SelectItem key='Kenya' value='Kenya'>
									Kenya
								</SelectItem>
								<SelectItem key='Kiribati' value='Kiribati'>
									Kiribati
								</SelectItem>
								<SelectItem key='Korea, North' value='Korea, North'>
									Korea, North
								</SelectItem>
								<SelectItem key='Korea, South' value='Korea, South'>
									Korea, South
								</SelectItem>
								<SelectItem key='Kosovo' value='Kosovo'>
									Kosovo
								</SelectItem>
								<SelectItem key='Kuwait' value='Kuwait'>
									Kuwait
								</SelectItem>
								<SelectItem key='Kyrgyzstan' value='Kyrgyzstan'>
									Kyrgyzstan
								</SelectItem>
								<SelectItem key='Laos' value='Laos'>
									Laos
								</SelectItem>
								<SelectItem key='Latvia' value='Latvia'>
									Latvia
								</SelectItem>
								<SelectItem key='Lebanon' value='Lebanon'>
									Lebanon
								</SelectItem>
								<SelectItem key='Lesotho' value='Lesotho'>
									Lesotho
								</SelectItem>
								<SelectItem key='Liberia' value='Liberia'>
									Liberia
								</SelectItem>
								<SelectItem key='Libya' value='Libya'>
									Libya
								</SelectItem>
								<SelectItem key='Liechtenstein' value='Liechtenstein'>
									Liechtenstein
								</SelectItem>
								<SelectItem key='Lithuania' value='Lithuania'>
									Lithuania
								</SelectItem>
								<SelectItem key='Luxembourg' value='Luxembourg'>
									Luxembourg
								</SelectItem>
								<SelectItem key='Madagascar' value='Madagascar'>
									Madagascar
								</SelectItem>
								<SelectItem key='Malawi' value='Malawi'>
									Malawi
								</SelectItem>
								<SelectItem key='Malaysia' value='Malaysia'>
									Malaysia
								</SelectItem>
								<SelectItem key='Maldives' value='Maldives'>
									Maldives
								</SelectItem>
								<SelectItem key='Mali' value='Mali'>
									Mali
								</SelectItem>
								<SelectItem key='Malta' value='Malta'>
									Malta
								</SelectItem>
								<SelectItem key='Marshall Islands' value='Marshall Islands'>
									Marshall Islands
								</SelectItem>
								<SelectItem key='Mauritania' value='Mauritania'>
									Mauritania
								</SelectItem>
								<SelectItem key='Mauritius' value='Mauritius'>
									Mauritius
								</SelectItem>
								<SelectItem key='Mexico' value='Mexico'>
									Mexico
								</SelectItem>
								<SelectItem key='Micronesia' value='Micronesia'>
									Micronesia
								</SelectItem>
								<SelectItem key='Moldova' value='Moldova'>
									Moldova
								</SelectItem>
								<SelectItem key='Monaco' value='Monaco'>
									Monaco
								</SelectItem>
								<SelectItem key='Mongolia' value='Mongolia'>
									Mongolia
								</SelectItem>
								<SelectItem key='Montenegro' value='Montenegro'>
									Montenegro
								</SelectItem>
								<SelectItem key='Morocco' value='Morocco'>
									Morocco
								</SelectItem>
								<SelectItem key='Mozambique' value='Mozambique'>
									Mozambique
								</SelectItem>
								<SelectItem key='Myanmar' value='Myanmar'>
									Myanmar
								</SelectItem>
								<SelectItem key='Namibia' value='Namibia'>
									Namibia
								</SelectItem>
								<SelectItem key='Nauru' value='Nauru'>
									Nauru
								</SelectItem>
								<SelectItem key='Nepal' value='Nepal'>
									Nepal
								</SelectItem>
								<SelectItem key='Netherlands' value='Netherlands'>
									Netherlands
								</SelectItem>
								<SelectItem key='New Zealand' value='New Zealand'>
									New Zealand
								</SelectItem>
								<SelectItem key='Nicaragua' value='Nicaragua'>
									Nicaragua
								</SelectItem>
								<SelectItem key='Niger' value='Niger'>
									Niger
								</SelectItem>
								<SelectItem key='Nigeria' value='Nigeria'>
									Nigeria
								</SelectItem>
								<SelectItem key='North Macedonia' value='North Macedonia'>
									North Macedonia
								</SelectItem>
								<SelectItem key='Norway' value='Norway'>
									Norway
								</SelectItem>
								<SelectItem key='Oman' value='Oman'>
									Oman
								</SelectItem>
								<SelectItem key='Pakistan' value='Pakistan'>
									Pakistan
								</SelectItem>
								<SelectItem key='Palau' value='Palau'>
									Palau
								</SelectItem>
								<SelectItem key='Palestine' value='Palestine'>
									Palestine
								</SelectItem>
								<SelectItem key='Panama' value='Panama'>
									Panama
								</SelectItem>
								<SelectItem key='Papua New Guinea' value='Papua New Guinea'>
									Papua New Guinea
								</SelectItem>
								<SelectItem key='Paraguay' value='Paraguay'>
									Paraguay
								</SelectItem>
								<SelectItem key='Peru' value='Peru'>
									Peru
								</SelectItem>
								<SelectItem key='Philippines' value='Philippines'>
									Philippines
								</SelectItem>
								<SelectItem key='Poland' value='Poland'>
									Poland
								</SelectItem>
								<SelectItem key='Portugal' value='Portugal'>
									Portugal
								</SelectItem>
								<SelectItem key='Qatar' value='Qatar'>
									Qatar
								</SelectItem>
								<SelectItem key='Romania' value='Romania'>
									Romania
								</SelectItem>
								<SelectItem key='Russia' value='Russia'>
									Russia
								</SelectItem>
								<SelectItem key='Rwanda' value='Rwanda'>
									Rwanda
								</SelectItem>
								<SelectItem
									key='Saint Kitts and Nevis'
									value='Saint Kitts and Nevis'
								>
									Saint Kitts and Nevis
								</SelectItem>
								<SelectItem key='Saint Lucia' value='Saint Lucia'>
									Saint Lucia
								</SelectItem>
								<SelectItem
									key='Saint Vincent and the Grenadines'
									value='Saint Vincent and the Grenadines'
								>
									Saint Vincent and the Grenadines
								</SelectItem>
								<SelectItem key='Samoa' value='Samoa'>
									Samoa
								</SelectItem>
								<SelectItem key='San Marino' value='San Marino'>
									San Marino
								</SelectItem>
								<SelectItem
									key='Sao Tome and Principe'
									value='Sao Tome and Principe'
								>
									Sao Tome and Principe
								</SelectItem>
								<SelectItem key='Saudi Arabia' value='Saudi Arabia'>
									Saudi Arabia
								</SelectItem>
								<SelectItem key='Senegal' value='Senegal'>
									Senegal
								</SelectItem>
								<SelectItem key='Serbia' value='Serbia'>
									Serbia
								</SelectItem>
								<SelectItem key='Seychelles' value='Seychelles'>
									Seychelles
								</SelectItem>
								<SelectItem key='Sierra Leone' value='Sierra Leone'>
									Sierra Leone
								</SelectItem>
								<SelectItem key='Singapore' value='Singapore'>
									Singapore
								</SelectItem>
								<SelectItem key='Slovakia' value='Slovakia'>
									Slovakia
								</SelectItem>
								<SelectItem key='Slovenia' value='Slovenia'>
									Slovenia
								</SelectItem>
								<SelectItem key='Solomon Islands' value='Solomon Islands'>
									Solomon Islands
								</SelectItem>
								<SelectItem key='Somalia' value='Somalia'>
									Somalia
								</SelectItem>
								<SelectItem key='South Africa' value='South Africa'>
									South Africa
								</SelectItem>
								<SelectItem key='South Sudan' value='South Sudan'>
									South Sudan
								</SelectItem>
								<SelectItem key='Spain' value='Spain'>
									Spain
								</SelectItem>
								<SelectItem key='Sri Lanka' value='Sri Lanka'>
									Sri Lanka
								</SelectItem>
								<SelectItem key='Sudan' value='Sudan'>
									Sudan
								</SelectItem>
								<SelectItem key='Suriname' value='Suriname'>
									Suriname
								</SelectItem>
								<SelectItem key='Sweden' value='Sweden'>
									Sweden
								</SelectItem>
								<SelectItem key='Switzerland' value='Switzerland'>
									Switzerland
								</SelectItem>
								<SelectItem key='Syria' value='Syria'>
									Syria
								</SelectItem>
								<SelectItem key='Taiwan' value='Taiwan'>
									Taiwan
								</SelectItem>
								<SelectItem key='Tajikistan' value='Tajikistan'>
									Tajikistan
								</SelectItem>
								<SelectItem key='Tanzania' value='Tanzania'>
									Tanzania
								</SelectItem>
								<SelectItem key='Thailand' value='Thailand'>
									Thailand
								</SelectItem>
								<SelectItem key='Togo' value='Togo'>
									Togo
								</SelectItem>
								<SelectItem key='Tonga' value='Tonga'>
									Tonga
								</SelectItem>
								<SelectItem
									key='Trinidad and Tobago'
									value='Trinidad and Tobago'
								>
									Trinidad and Tobago
								</SelectItem>
								<SelectItem key='Tunisia' value='Tunisia'>
									Tunisia
								</SelectItem>
								<SelectItem key='Turkey' value='Turkey'>
									Turkey
								</SelectItem>
								<SelectItem key='Turkmenistan' value='Turkmenistan'>
									Turkmenistan
								</SelectItem>
								<SelectItem key='Tuvalu' value='Tuvalu'>
									Tuvalu
								</SelectItem>
								<SelectItem key='Uganda' value='Uganda'>
									Uganda
								</SelectItem>
								<SelectItem key='Ukraine' value='Ukraine'>
									Ukraine
								</SelectItem>
								<SelectItem
									key='United Arab Emirates'
									value='United Arab Emirates'
								>
									United Arab Emirates
								</SelectItem>
								<SelectItem key='United Kingdom' value='United Kingdom'>
									United Kingdom
								</SelectItem>
								<SelectItem key='United States' value='United States'>
									United States
								</SelectItem>
								<SelectItem key='Uruguay' value='Uruguay'>
									Uruguay
								</SelectItem>
								<SelectItem key='Uzbekistan' value='Uzbekistan'>
									Uzbekistan
								</SelectItem>
								<SelectItem key='Vanuatu' value='Vanuatu'>
									Vanuatu
								</SelectItem>
								<SelectItem key='Vatican City' value='Vatican City'>
									Vatican City
								</SelectItem>
								<SelectItem key='Venezuela' value='Venezuela'>
									Venezuela
								</SelectItem>
								<SelectItem key='Vietnam' value='Vietnam'>
									Vietnam
								</SelectItem>
								<SelectItem key='Yemen' value='Yemen'>
									Yemen
								</SelectItem>
								<SelectItem key='Zambia' value='Zambia'>
									Zambia
								</SelectItem>
								<SelectItem key='Zimbabwe' value='Zimbabwe'>
									Zimbabwe
								</SelectItem>
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

			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
											isRequired
										/>
										<Input
											type='text'
											name='company'
											label='Company'
											isRequired
										/>
										<Input
											name='workLocation'
											label='Location'
											placeholder='Job location'
											variant='bordered'
											radius='sm'
											isRequired
										/>
										<Input
											name='description'
											label='Description'
											placeholder='Please give a brief description'
											variant='bordered'
											radius='sm'
											isRequired
										/>
										<div className='flex gap-1 items-center'>
											<Select
												name='startMonth'
												label='Start Month'
												variant='bordered'
												radius='sm'
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
												name='startYear'
												label='Start Year'
												variant='bordered'
												radius='sm'
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
										onPress={onClose}
										isDisabled={mutation.isLoading}
										isLoading={mutation.isLoading}
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
