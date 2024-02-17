'use client';
import { User } from '@/db/schema';
import { Button } from '@nextui-org/button';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal';
import { Send } from 'lucide-react';
import { Input } from '@nextui-org/input';
import { Textarea } from '@nextui-org/react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

export default function MessageButton({ user }: { user: User }) {
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const router = useRouter();

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
				startContent={<Send />}
				size='sm'
				onPress={onOpen}
			>
				Message
			</Button>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>New message</ModalHeader>
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
											value={`${user.id}`}
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
										endContent={<Send />}
										onPress={onClose}
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
