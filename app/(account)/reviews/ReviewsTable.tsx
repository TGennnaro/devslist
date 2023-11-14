'use client';
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@nextui-org/table';
import { PenLine, Star, X } from 'lucide-react';
import { Button, ButtonGroup } from '@nextui-org/button';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal';
import { Slider } from '@nextui-org/react';

export default function ReviewsTable() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	return (
		<>
			<Table className='mt-8' aria-label='My applications' isStriped>
				<TableHeader>
					<TableColumn>COMPANY</TableColumn>
					<TableColumn>REVIEWED</TableColumn>
					<TableColumn>RATING</TableColumn>
					<TableColumn>ACTIONS</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow key='1'>
						<TableCell>Apple, Inc.</TableCell>
						<TableCell>{new Date().toLocaleDateString()}</TableCell>
						<TableCell>
							<div className='flex flex-row items-center gap-1 font-semibold'>
								4.5 <Star color='gold' />
							</div>
						</TableCell>
						<TableCell>
							<ButtonGroup>
								<Button
									size='sm'
									color='default'
									variant='flat'
									startContent={<PenLine />}
									onPress={onOpen}
								>
									Change
								</Button>
								<Button
									size='sm'
									color='danger'
									variant='flat'
									startContent={<X />}
								>
									Remove
								</Button>
							</ButtonGroup>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose: () => void) => (
						<>
							<ModalHeader className='flex flex-col gap-1'>
								Update Review
							</ModalHeader>
							<ModalBody>
								<p>
									You are updating your review for:{' '}
									<span className='font-bold'>Apple, Inc.</span>.
									<div className='mt-5'>
										<Slider
											label={
												<div className='flex flex-row items-center gap-1'>
													Select a rating <Star color='gold' />
												</div>
											}
											color='warning'
											showTooltip={true}
											step={0.5}
											maxValue={5}
											minValue={0}
											marks={[
												{
													value: 0,
													label: '0',
												},
												{
													value: 0.5,
													label: '0.5',
												},
												{
													value: 1,
													label: '1',
												},
												{
													value: 1.5,
													label: '1.5',
												},
												{
													value: 2.0,
													label: '2',
												},
												{
													value: 2.5,
													label: '2.5',
												},
												{
													value: 3.0,
													label: '3',
												},
												{
													value: 3.5,
													label: '3.5',
												},
												{
													value: 4.0,
													label: '4',
												},
												{
													value: 4.5,
													label: '4.5',
												},
												{
													value: 5.0,
													label: '5',
												},
											]}
											defaultValue={0}
											className='max-w-md'
										/>
									</div>
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Cancel
								</Button>
								<Button color='primary' onPress={onClose}>
									Update Review
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
