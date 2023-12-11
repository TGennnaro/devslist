'use client';

import AddressSearch from '@/components/AddressSearch';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@nextui-org/button';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/modal';
import { Switch } from '@nextui-org/switch';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

export default function NewCompanyButton() {
	const [isOpen, setIsOpen] = useState(false);
	const [location, setLocation] = useState('');

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const target = e.target as HTMLFormElement;
			const formData = new FormData(target as HTMLFormElement);
			for (const checkbox of target.querySelectorAll('input[type=checkbox]')) {
				const checkboxInput = checkbox as HTMLInputElement;
				formData.set(checkboxInput.name, checkboxInput.checked.toString());
			}
			return fetch('/api/companies', {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			if (res.status === 200) {
				queryClient.invalidateQueries('list_companies');
				setIsOpen(false);
				toast.success('Company created');
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
				New Company
			</Button>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<form onSubmit={mutation.mutate}>
							<ModalHeader>New Company</ModalHeader>
							<ModalBody className='gap-4'>
								<Input
									name='companyName'
									label='Name'
									labelPlacement='outside'
									placeholder='Enter the company name'
								/>
								<Textarea
									name='companyDescription'
									label='Description'
									labelPlacement='outside'
									placeholder='Describe your company'
									minRows={5}
									rows={5}
								/>
								<AddressSearch
									setLocation={setLocation}
									placeholder='Search an address...'
									label='Address'
									labelPlacement='outside'
									name='companyAddress'
								/>
								<Input
									name='companyUrl'
									label='Website'
									placeholder="Enter the company's website"
									labelPlacement='outside'
								/>
								<Switch
									name='companyTerms'
									classNames={{
										wrapper: 'bg-default-300',
									}}
									size='sm'
								>
									I agree to the Terms and Conditions
								</Switch>
							</ModalBody>
							<ModalFooter>
								<Button color='danger' variant='light' onPress={onClose}>
									Close
								</Button>
								<Button
									color='primary'
									startContent={<Plus size={16} />}
									type='submit'
									isLoading={mutation.isLoading}
								>
									Create
								</Button>
							</ModalFooter>
						</form>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
