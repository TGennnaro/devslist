'use client';
import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import { Checkbox } from '@nextui-org/checkbox';
import { Chip } from '@nextui-org/chip';
import { Input, Textarea } from '@nextui-org/input';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/popover';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { Calendar, Plus, Send } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

const AddressSearch = dynamic(
	() => import('@/app/(jobs)/jobs/post/AddressSearch'),
	{
		ssr: false,
	}
);

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

	return (
		<form onSubmit={mutation.mutate}>
			<div className='flex items-center justify-center mt-8 mb-20'>
				<div className='basis-full'>
					<div className='flex flex-col max-w-screen-md gap-6'>
						<Input
							name='jobTitle'
							label='Job Title'
							labelPlacement='outside'
							placeholder='Software Engineer'
							variant='bordered'
							radius='sm'
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
							label='Job description'
							labelPlacement='outside'
							placeholder='Join the team in developing game-changing software!'
							variant='bordered'
							radius='sm'
							isRequired
							minRows={4}
						/>
						<Textarea
							name='jobRequirements'
							label='Job requirements'
							labelPlacement='outside'
							placeholder="Bachelor's degree in Computer Science or equivalent."
							variant='bordered'
							radius='sm'
							isRequired
							minRows={4}
						/>
						<Textarea
							name='jobResponsibilities'
							label='Job responsibilities'
							labelPlacement='outside'
							placeholder='Develop AI and machine learning algorithms.'
							variant='bordered'
							radius='sm'
							isRequired
							minRows={4}
						/>

						<Input
							label='Enter required skills (one at a time)'
							labelPlacement='outside'
							placeholder='Python'
							variant='bordered'
							radius='sm'
							value={skillValue}
							onValueChange={setSkillValue}
							endContent={
								<button type='button'>
									<Plus onClick={() => addToSkillsList()} />
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
						<Input
							name='expirationDate'
							label='Job posting expiration date'
							labelPlacement='outside-left'
							isReadOnly
							placeholder={selected?.toLocaleDateString()}
							value={selected?.toLocaleDateString()}
							variant='bordered'
							radius='sm'
							endContent={
								<Popover
									placement='bottom'
									showArrow={true}
									isOpen={isDateSelectorOpen}
									onOpenChange={(open) => setIsDateSelectorOpen(open)}
								>
									<PopoverTrigger>
										<button type='button'>
											<Calendar />
										</button>
									</PopoverTrigger>
									<PopoverContent>
										<div className='px-1 py-2'>
											<DayPicker
												mode='single'
												required
												selected={selected}
												onSelect={setSelected}
												onDayClick={() => setIsDateSelectorOpen(false)}
											/>
										</div>
									</PopoverContent>
								</Popover>
							}
						/>

						<AddressSearch
							setLocation={setWorkLocation}
							disabled={remotePosition}
							name='jobLocation'
							label='Job location'
							labelPlacement='outside'
							placeholder='Search address...'
							variant='bordered'
							radius='sm'
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
