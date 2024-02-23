'use client';

import { Button } from '@nextui-org/button';
import { Send } from 'lucide-react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';

export default function ApplyButton({ id }: { id: number }) {
	const mutation = useMutation({
		mutationFn: async () => {
			return await fetch('/api/jobs/apply?id=' + id, {
				method: 'POST',
			});
		},
		onSuccess: async (res) => {
			const json = await res.json();
			if (res.status === 200) toast.success('Application submitted');
			else toast.error('Error: ' + json.message);
		},
	});

	return (
		<Button
			startContent={<Send size={16} />}
			variant='solid'
			color='primary'
			onClick={() => mutation.mutate()}
			isLoading={mutation.isLoading}
		>
			Apply
		</Button>
	);
}
