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
	useDisclosure,
} from '@nextui-org/modal';
import { Switch } from '@nextui-org/switch';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function NewCompanyButton() {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [location, setLocation] = useState('');
	return (
		<>
			<Button
				color='primary'
				startContent={<Plus size={16} />}
				onPress={onOpen}
			>
				New Company
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<form>
							<ModalHeader>New Company</ModalHeader>
							<ModalBody className='gap-6'>
								<Input
									name='company-name'
									label='Name'
									labelPlacement='outside'
									placeholder='Enter the company name'
								/>
								<Textarea
									name='company-desc'
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
								/>
								<Input
									name='company-url'
									label='Website'
									placeholder="Enter the company's website"
									labelPlacement='outside'
								/>
								<Switch
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
								<Button color='primary' startContent={<Plus size={16} />}>
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
