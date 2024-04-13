'use client';
import { Input, Textarea } from '@/components/ui/input';
import { User } from '@/db/schema';
import { Button } from '@nextui-org/button';
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@nextui-org/modal';
import { Mail, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function MessageButton({ id }: { id: number }) {
	const [isOpen, setIsOpen] = useState(false);

	const mutation = useMutation({
		mutationFn: async (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			return await fetch(`/api/messages`, {
				method: 'POST',
				body: formData,
			});
		},
		onSuccess: async (res) => {
			const json = await res.json();
			if (res.status === 200) {
				toast.success('Message sent!');
				setIsOpen(false);
			} else {
				console.error(json.message);
				toast.error('Error: ' + json.message.message);
			}
		},
	});

	return (
		<>
			<Button
				color='default'
				variant='solid'
				startContent={<Mail size={16} />}
				size='sm'
				onPress={() => setIsOpen(true)}
			>
				Message
			</Button>
			<Modal isOpen={isOpen} onOpenChange={setIsOpen}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>New Message</ModalHeader>
							<form onSubmit={mutation.mutate}>
								<ModalBody>
									<div className='flex flex-col gap-1'>
										<Input
											type='text'
											name='subject'
											label='Subject'
											isRequired
										/>
										<Input
											type='text'
											name='toID'
											label='To ID'
											value={`${id}`}
											className='hidden'
										/>
										<Textarea label='Body' name='body' isRequired />
									</div>
								</ModalBody>
								<ModalFooter>
									<Button color='danger' variant='light' onPress={onClose}>
										Cancel
									</Button>
									<Button
										color='primary'
										type='submit'
										endContent={<Send size={16} />}
										isDisabled={mutation.isLoading}
										isLoading={mutation.isLoading}
									>
										Send
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
