'use client';
import { Experience } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@nextui-org/select';
import { Select } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal';

export default function NewWorkExperienceButton({
	history,
	setHistory,
}: {
	history: Experience[];
	setHistory: React.Dispatch<React.SetStateAction<any>>;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [hasEndDate, setHasEndDate] = useState(false);

	const mutation = useMutation({
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
				setIsOpen(false);
				setHasEndDate(false);
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
			<Button
				color='primary'
				startContent={<Plus size={16} />}
				onPress={() => setIsOpen(true)}
			>
				Add
			</Button>

			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Add Work Experience</ModalHeader>
							<form onSubmit={mutation.mutate}>
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
											isSelected={hasEndDate}
											onChange={() => setHasEndDate(!hasEndDate)}
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
