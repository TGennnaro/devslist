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
import { Building2, Save } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';
import CompanyForm from './CompanyForm';
import { parseFormData } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CompanyCard({ company }: { company: Company }) {
	const queryClient = useQueryClient();
	const router = useRouter();
	const editMutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			const formData = parseFormData(e);
			return fetch(`/api/companies?id=${company.id}`, {
				method: 'PATCH',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			if (res.status === 200) {
				setIsEditOpen(false);
				queryClient.invalidateQueries('list_companies');
				toast.success('Company updated');
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
	const [isEditOpen, setIsEditOpen] = useState(false);
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
								onClick: () => router.push(`/companies/${company.id}`),
							},
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
					<Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
						<ModalContent>
							{(onClose) => (
								<form onSubmit={editMutation.mutate}>
									<ModalHeader>Edit {company.name}</ModalHeader>
									<ModalBody>
										<ModalBody className='gap-4'>
											<CompanyForm defaultValues={company} />
										</ModalBody>
									</ModalBody>
									<ModalFooter>
										<Button variant='light' onPress={onClose}>
											Cancel
										</Button>
										<Button
											isLoading={editMutation.isLoading}
											color='primary'
											type='submit'
											startContent={<Save size={16} />}
										>
											Save
										</Button>
									</ModalFooter>
								</form>
							)}
						</ModalContent>
					</Modal>
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
