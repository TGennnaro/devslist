'use client';
import { Experience, User } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@nextui-org/select';
import { Select } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
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
import OptionsButton from '@/components/OptionsButton';
import { Card } from '@/components/ui/card';
import { CardBody } from '@nextui-org/card';

export default function WorkExperienceEntry({ job }: { job: Experience }) {
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [hasEndDate, setHasEndDate] = useState(
		job.endMonth !== null && job.endYear !== null
	);
	const [isVisible, setIsVisible] = useState(true);

	const editMutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const target = e.target as HTMLFormElement;
			const formData = new FormData(target as HTMLFormElement);
			return fetch(`/api/profile/workhistory?id=${job.id}`, {
				method: 'PATCH',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			if (res.status === 200) {
				const json = await res.json();
				toast.success('Work experience updated!');
				//setHasEndDate(false);
				setIsEditOpen(false);
				const { data } = json;
				Object.assign(job, data);
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

	const deleteMutation = useMutation({
		mutationFn: (id: number) => {
			return fetch(`/api/profile/workhistory?id=${id}`, {
				method: 'DELETE',
			});
		},
		onSuccess: () => {
			setIsDeleteOpen(false);
			toast.success('Work experience deleted!');
			setIsVisible(false);
		},
	});

	return isVisible ? (
		<>
			<Card>
				<CardBody className='flex flex-col gap-3 mb-5' key={job.id}>
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
						<div className='ml-auto mr-0'>
							<OptionsButton
								className='ml-auto'
								options={[
									{
										label: 'Edit',
										onClick: () => setIsEditOpen(true),
									},
									{
										label: 'Delete',
										color: 'danger',
										className: 'text-danger',
										onClick: () => setIsDeleteOpen(true),
									},
								]}
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			<Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Edit {job.position}</ModalHeader>
							<form onSubmit={editMutation.mutate}>
								<ModalBody>
									<div className='flex flex-col gap-1'>
										<Input
											type='text'
											name='jobTitle'
											label='Job title'
											size='sm'
											defaultValue={job.position}
											isRequired
										/>
										<Input
											type='text'
											name='company'
											label='Company'
											size='sm'
											defaultValue={job.company}
											isRequired
										/>
										<Input
											name='workLocation'
											label='Location'
											variant='bordered'
											radius='sm'
											size='sm'
											defaultValue={job.location ?? ''}
											isRequired
										/>
										<Input
											name='description'
											label='Description'
											placeholder='Please give a brief description'
											variant='bordered'
											radius='sm'
											size='sm'
											defaultValue={job.description}
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
												defaultSelectedKeys={[`${job.startMonth}`]}
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
												defaultSelectedKeys={[`${job.startYear}`]}
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

										{hasEndDate && (
											<div className='flex gap-1 items-center'>
												<Select
													name='endMonth'
													label='End Month'
													variant='bordered'
													radius='sm'
													size='sm'
													isRequired
													defaultSelectedKeys={[`${job.endMonth}`]}
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
													defaultSelectedKeys={[`${job.endYear}`]}
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
											isSelected={!hasEndDate}
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
										isDisabled={editMutation.isLoading}
										isLoading={editMutation.isLoading}
									>
										Edit
									</Button>
								</ModalFooter>
							</form>
						</>
					)}
				</ModalContent>
			</Modal>

			<Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Delete {job.position}</ModalHeader>
							<ModalBody>
								Are you sure you want to delete this work experience entry?
							</ModalBody>
							<ModalFooter>
								<Button variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button
									isLoading={deleteMutation.isLoading}
									color='danger'
									onPress={() => {
										deleteMutation.mutate(job.id);
									}}
								>
									Delete
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	) : null;
}
