'use client';

import { Select } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/types';
import { SelectItem } from '@nextui-org/react';
import { Check, Hourglass, MessagesSquare, Undo2, X } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'sonner';

export const statusInfo: {
	[key: number]: {
		color: string;
		icon: JSX.Element;
		text: string;
		selectable?: boolean;
	};
} = {
	[ApplicationStatus.PENDING]: {
		color: '!text-primary',
		icon: <Hourglass size={16} />,
		text: 'Pending Review',
	},
	[ApplicationStatus.CONSIDERATION]: {
		color: '!text-purple-400',
		icon: <MessagesSquare size={16} />,
		text: 'Under Consideration',
	},
	[ApplicationStatus.ACCEPTED]: {
		color: '!text-success',
		icon: <Check size={16} />,
		text: 'Accepted',
	},
	[ApplicationStatus.REJECTED]: {
		color: '!text-danger',
		icon: <X size={16} />,
		text: 'Discontinued',
	},
	[ApplicationStatus.WITHDRAWN]: {
		color: '!text-warning',
		icon: <Undo2 size={16} />,
		text: 'Withdrawn',
		selectable: false,
	},
};

export default function StatusSelect({
	id,
	status,
}: {
	id: number;
	status: ApplicationStatus;
}) {
	const queryClient = useQueryClient();
	const { isLoading, mutate } = useMutation({
		mutationFn: ({
			prevVal,
			newVal,
		}: {
			prevVal: ApplicationStatus;
			newVal: ApplicationStatus;
		}) =>
			fetch('/api/companies/applications?id=' + id, {
				method: 'PATCH',
				body: JSON.stringify({ prevVal, newVal }),
			}),
		onSettled: async (res) => {
			if (res?.status !== 200) {
				const json = await res?.json();
				setSelected(json.value);
				toast.error('Error updating application status: ' + json.error);
				console.error('Error updating application status: ', json.error);
			} else queryClient.invalidateQueries('applications');
		},
	});
	const [selected, setSelected] = useState<ApplicationStatus>(status);
	return (
		<Select
			className='min-w-[140px]'
			classNames={{
				innerWrapper: cn(
					statusInfo[selected].color,
					isLoading ? 'animate-pulse' : ''
				),
				value: cn(statusInfo[selected].color, isLoading ? 'animate-pulse' : ''),
			}}
			labelPlacement='outside'
			aria-label='Application status'
			onSelectionChange={(val) => {
				if (Array.from(val).length > 0) {
					const newVal = Array.from(val)[0] as ApplicationStatus;
					mutate({
						prevVal: status,
						newVal,
					});
					setSelected(newVal);
				}
			}}
			selectedKeys={[String(selected)]}
			startContent={statusInfo[selected].icon}
		>
			{Object.entries(statusInfo)
				.filter(([_, value]) => value.selectable ?? true)
				.map(([key, value]) => (
					<SelectItem
						key={key}
						startContent={value.icon}
						className={value.color}
					>
						{value.text}
					</SelectItem>
				))}
		</Select>
	);
}
