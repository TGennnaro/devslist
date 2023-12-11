'use client';

import OptionsButton from '@/components/OptionsButton';
import { Card } from '@/components/ui/card';
import { Company } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { CardBody } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/modal';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function CompanyCard({ company }: { company: Company }) {
	const queryClient = useQueryClient();
	const deleteMutation = useMutation({
		mutationFn: (id: number) => {
			return fetch(`/api/companies?id=${id}`, {
				method: 'DELETE',
			});
		},
		onSuccess: () => {
			setIsDeleteOpen(false);
			queryClient.invalidateQueries('list_companies');
			toast.success('Company deleted');
		},
	});
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	return (
		<li key={company.id}>
			<Card>
				<CardBody className='flex flex-row items-center gap-8 p-4'>
					{company.logo ? (
						<Image
							isBlurred
							alt='Company logo'
							height={40}
							radius='sm'
							src={company.logo}
							width={40}
							className='object-contain aspect-square'
						/>
					) : (
						<div className='grid w-10 rounded-lg aspect-square bg-content2 place-content-center'>
							<Building2 size={24} className='text-content4' />
						</div>
					)}
					<span className='text-xl font-medium'>{company.name}</span>
					<OptionsButton
						className='ml-auto'
						options={[
							{
								label: 'View applications',
							},
							{
								label: 'Edit',
							},
							{
								label: 'Delete',
								color: 'danger',
								className: 'text-danger',
								onClick: () => setIsDeleteOpen(true),
							},
						]}
					/>
					<Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
						<ModalContent>
							{(onClose) => (
								<>
									<ModalHeader>Delete Company</ModalHeader>
									<ModalBody>
										Are you sure you want to delete this company?
									</ModalBody>
									<ModalFooter>
										<Button variant='light' onPress={onClose}>
											Cancel
										</Button>
										<Button
											isLoading={deleteMutation.isLoading}
											color='danger'
											onPress={() => {
												deleteMutation.mutate(company.id);
											}}
										>
											Delete
										</Button>
									</ModalFooter>
								</>
							)}
						</ModalContent>
					</Modal>
				</CardBody>
			</Card>
		</li>
	);
}
