'use client';
import AddressSearch from '@/components/AddressSearch';
import DatePicker from '@/components/DatePicker';
import { Input, Select, Textarea } from '@/components/ui/input';
import { Company } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Checkbox } from '@nextui-org/checkbox';
import { Chip } from '@nextui-org/chip';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { SelectItem } from '@nextui-org/select';
import { Plus, Send } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import 'react-day-picker/dist/style.css';
import { useMutation, useQuery } from 'react-query';
import { toast } from 'sonner';

export default function JobPostingForm() {
	const [payTypeSelectionHidden, setPayTypeSelectionHidden] = useState(false);
	const [hourlyInputHidden, setHourlyInputHidden] = useState(true);
	const [salaryInputHidden, setSalaryInputHidden] = useState(true);
	const [remotePosition, setRemotePosition] = useState(false);
	const [workLocation, setWorkLocation] = useState<string>('');
	const [skillsList, setSkillsList] = useState<string[]>([]);
	const [skillValue, setSkillValue] = useState('');
	const [selected, setSelected] = useState<Date | undefined>(new Date());
	const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
	const [companyOpen, setCompanyOpen] = useState(false);
	const session = useSession();
	const router = useRouter();

	const mutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			formData.append('skills', JSON.stringify(skillsList));
			return await fetch('/api/jobs', {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			const json = await res.json();
			if (res.status === 200) {
				router.push(`/jobs/${json.id}`);
			} else {
				console.error(json.message);
				toast.error('Error: ' + json.message.message);
			}
		},
	});

	const { data: companyList, isLoading: companyListLoading } = useQuery({
		queryKey: ['companies', session.data?.user.id],
		queryFn: async () => {
			const res = await fetch(`/api/companies/users/${session.data?.user.id}`);
			if (!res.ok) throw new Error('Network error occurred');
			return (await res.json()).results;
		},
	});

	function handleShowPayTypeSelection() {
		setSalaryInputHidden(true);
		setHourlyInputHidden(true);
		payTypeSelectionHidden
			? setPayTypeSelectionHidden(false)
			: setPayTypeSelectionHidden(true);
	}

	function handleShowHourlyInput() {
		setSalaryInputHidden(true);
		hourlyInputHidden
			? setHourlyInputHidden(false)
			: setHourlyInputHidden(true);
	}

	function handleShowSalaryInput() {
		setHourlyInputHidden(true);
		salaryInputHidden
			? setSalaryInputHidden(false)
			: setSalaryInputHidden(true);
	}

	function addToSkillsList() {
		if (skillValue) {
			skillsList.includes(skillValue)
				? console.log('already exists')
				: setSkillsList([...skillsList, skillValue]);
			setSkillValue('');
		}
	}
	console.log(companyList);

	return (
		<form onSubmit={mutation.mutate}>
			<div className='flex items-center justify-center mt-8 mb-20'>
				<div className='basis-full'>
					<div className='flex flex-col max-w-screen-md gap-6'>
						<Select
							name='companyId'
							isLoading={companyListLoading}
							items={(companyList as Company[]) ?? []}
							label='Company'
							placeholder='Select the associated company'
							labelPlacement='outside'
							isRequired
							isOpen={companyOpen}
							onOpenChange={setCompanyOpen}
						>
							{(item) => (
								<SelectItem
									key={(item as Company).id}
									value={(item as Company).id}
								>
									{(item as Company).name}
								</SelectItem>
							)}
						</Select>
						<Input
							name='jobTitle'
							label='Title'
							labelPlacement='outside'
							placeholder='Enter the job title'
							isRequired
						/>
						<RadioGroup label='Job type' isRequired name='jobType'>
							<Radio value='Full-Time'>Full-Time</Radio>
							<Radio value='Part-Time'>Part-Time</Radio>
							<Radio value='Internship'>Internship</Radio>
							<Radio value='Freelance'>Freelance</Radio>
						</RadioGroup>
						<Textarea
							name='jobDescription'
							label='Description'
							labelPlacement='outside'
							placeholder='Describe the job in detail'
							isRequired
							minRows={4}
						/>
						<Textarea
							name='jobRequirements'
							label='Requirements'
							labelPlacement='outside'
							placeholder="Describe a candidate's requirements"
							isRequired
							minRows={4}
						/>
						<Textarea
							name='jobResponsibilities'
							label='Responsibilities'
							labelPlacement='outside'
							placeholder='Describe the job responsibilities'
							isRequired
							minRows={4}
						/>

						<Input
							label='Associated skills'
							labelPlacement='outside'
							placeholder='Enter a skill and press Enter'
							value={skillValue}
							onValueChange={setSkillValue}
							endContent={
								<button type='button'>
									<Plus
										onClick={() => addToSkillsList()}
										className='text-default-400 dark:text-default-500'
									/>
								</button>
							}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									addToSkillsList();
								}
							}}
						/>
						{skillsList.length != 0 ? (
							<Card>
								<CardBody>
									<div className='flex flex-row flex-wrap items-center gap-2'>
										{skillsList.map((skill) => {
											return (
												<Chip
													key={skill}
													onClose={() =>
														setSkillsList((skillsList) =>
															skillsList.filter(
																(item: string) => item !== skill
															)
														)
													}
												>
													{skill}
												</Chip>
											);
										})}
									</div>
								</CardBody>
							</Card>
						) : null}

						<DatePicker
							name='expirationDate'
							label='Posting expiration date'
							labelPlacement='outside'
							placeholder={selected?.toLocaleDateString()}
							value={selected?.toLocaleDateString()}
							selected={selected}
							setSelected={setSelected}
							className='max-w-xs'
						/>

						<AddressSearch
							setLocation={setWorkLocation}
							disabled={remotePosition}
							name='jobLocation'
							label='Location'
							labelPlacement='outside'
							placeholder='Search address...'
							classNames={{
								base: 'max-w-xl',
							}}
						/>

						<Checkbox
							onValueChange={(value) => setRemotePosition(value)}
							name='showWorkLocation'
							value='true'
						>
							This job is remote
						</Checkbox>

						<Checkbox
							defaultSelected
							onClick={() => handleShowPayTypeSelection()}
							name='showPayRate'
							value='true'
						>
							Display pay rate (recommended){' '}
						</Checkbox>
						{payTypeSelectionHidden ? null : (
							<RadioGroup label='Select pay type' isRequired name='payType'>
								<Radio value='hourly' onChange={() => handleShowHourlyInput()}>
									Hourly rate
								</Radio>

								<Radio value='salary' onChange={() => handleShowSalaryInput()}>
									Yearly rate (salary)
								</Radio>
							</RadioGroup>
						)}
						{salaryInputHidden ? null : (
							<Input
								name='salary'
								label='Salary'
								labelPlacement='outside'
								placeholder='Salary'
								variant='bordered'
								radius='sm'
								isRequired
							/>
						)}
						{hourlyInputHidden ? null : (
							<Input
								name='hourlyRate'
								label='Hourly rate'
								labelPlacement='outside'
								placeholder='Hourly rate'
								variant='bordered'
								radius='sm'
								isRequired
							/>
						)}
					</div>

					<div className='flex flex-row items-center gap-3 mt-8'>
						<Button
							color='primary'
							onClick={() => console.log('post')}
							startContent={<Send size={16} />}
							type='submit'
							isDisabled={mutation.isLoading}
							isLoading={mutation.isLoading}
						>
							Post Job
						</Button>
					</div>
				</div>
			</div>
		</form>
	);
}
