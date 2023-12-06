'use client';

import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { MoreVertical } from 'lucide-react';

type Option = {
	label: string;
	color?: ButtonProps['color'];
	className?: string;
	onClick?: () => void;
};

export default function OptionsButton({
	options,
	className,
	...props
}: { options: Option[] } & ButtonProps) {
	return (
		<Dropdown>
			<DropdownTrigger>
				<Button
					variant='bordered'
					className={cn('min-w-0 p-1 rounded-full aspect-square', className)}
					{...props}
				>
					<MoreVertical size={16} />
				</Button>
			</DropdownTrigger>
			<DropdownMenu>
				{options.map((option) => (
					<DropdownItem
						key={option.label}
						color={option.color || 'default'}
						variant='flat'
						className={option.className}
					>
						{option.label}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
}
