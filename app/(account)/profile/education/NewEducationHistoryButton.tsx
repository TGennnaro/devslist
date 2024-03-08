'use client';
import { Education, Experience } from '@/db/schema';
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

export default function NewEducationHistoryButton({
	history,
	setHistory,
}: {
	history: Education[];
	setHistory: React.Dispatch<React.SetStateAction<any>>;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const [hasEndDate, setHasEndDate] = useState(false);

	const mutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const target = e.target as HTMLFormElement;
			const formData = new FormData(target as HTMLFormElement);
			return fetch('/api/profile/educationhistory', {
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
				const newEducationItem: Education = {
					userId: 0,
					id: json.id,
					schoolName: json.data.schoolName,
					location: json.data.location,
					degree: json.data.degree,
					gpa: json.data.gpa,
					startMonth: json.data.startMonth,
					startYear: json.data.startYear,
					endMonth: json.data.endMonth,
					endYear: json.data.endYear,
				};
				setHistory([...history, newEducationItem]);
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
							<ModalHeader>Add Education History</ModalHeader>
							<form onSubmit={mutation.mutate}>
								<ModalBody>
									<div className='flex flex-col gap-1'>
										<Input
											type='text'
											name='schoolName'
											label='School Name'
											size='sm'
											isRequired
										/>
										<Input
											type='text'
											name='degree'
											label='Degree'
											size='sm'
											isRequired
										/>
										<Input
											type='text'
											name='location'
											label='Location'
											size='sm'
											isRequired
										/>
										<Input
											name='gpa'
											label='GPA'
											variant='bordered'
											radius='sm'
											size='sm'
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
											I am still going here
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
