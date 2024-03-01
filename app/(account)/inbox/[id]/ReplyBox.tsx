'use client';
import { Message, User } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Send } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import { FormEvent } from 'react';

export default function ReplyBox({
	parentMessage,
}: {
	parentMessage: Message;
}) {
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
				toast.success('Reply sent!');
				window.location.reload();
			} else {
				console.error(json.message);
				toast.error('Error: ' + json.message.message);
			}
		},
	});

	return (
		<form onSubmit={mutation.mutate}>
			<div className='flex flex-col gap-1'>
				<Textarea label='Reply' name='body' />

				<Input
					type='text'
					name='subject'
					label='Subject'
					value={`RE: ${parentMessage?.subject}`}
					className='hidden'
				/>

				<Input
					type='text'
					name='toID'
					label='To ID'
					value={`${parentMessage.fromId}`}
					className='hidden'
				/>

				<Input
					type='text'
					name='parentMessageID'
					label='Parent Message ID'
					value={`${parentMessage?.parentMessageId ?? parentMessage?.id}`}
					className='hidden'
				/>

				<Button
					className='ml-auto mr-0 w-fit'
					color='primary'
					type='submit'
					endContent={<Send />}
					isDisabled={mutation.isLoading}
					isLoading={mutation.isLoading}
				>
					Reply
				</Button>
			</div>
		</form>
	);
}
