'use client';

import { Button } from '@nextui-org/button';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplyButton({ id }: { id: number }) {
	return (
		<Button
			startContent={<Send size={16} />}
			variant='solid'
			color='primary'
			onClick={() => {
				fetch('/api/jobs/apply?id=' + id, {
					method: 'POST',
				})
					.then((res) => res.json())
					.then((data) => {
						if (data.status === 200) toast.success('Application submitted');
						else toast.error('Error submitting application');
					});
			}}
		>
			Apply
		</Button>
	);
}
