'use client';
import { ApplicationStatus } from '@/types';
import { Button } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { Chip, Spinner } from '@nextui-org/react';
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@nextui-org/table';
import { format } from 'date-fns';
import { MoreVertical, Undo2, Link as LinkIcon } from 'lucide-react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { statusInfo } from '../companies/[id]/StatusSelect';
import { cn } from '@/lib/utils';

type Application = {
	id: number;
	company: string;
	position: string;
	dateApplied: string;
	lastUpdated: string;
	status: ApplicationStatus;
};

const columns = [
	{ key: 'company', name: 'Company' },
	{
		key: 'position',
		name: 'Position',
	},
	{
		key: 'dateApplied',
		name: 'Date Applied',
	},
	{
		key: 'lastUpdated',
		name: 'Last Updated',
	},
	{
		key: 'status',
		name: 'Status',
	},
	{
		key: 'actions',
		name: 'Actions',
	},
];

export default function ApplicationsTable() {
	const { data, isLoading, isError } = useQuery({
		queryKey: 'self_applications',
		queryFn: async () => {
			const res = await fetch('/api/applications');
			if (!res.ok) throw new Error('Network error occurred');
			return (await res.json()) as Application[];
		},
	});

	return (
		<Table className='mt-8' aria-label='My applications'>
			<TableHeader columns={columns}>
				{columns.map((column) => (
					<TableColumn key={column.key} className='bg-default-100/50'>
						{column.name}
					</TableColumn>
				))}
			</TableHeader>
			<TableBody
				items={data ?? []}
				loadingState={isLoading ? 'loading' : 'idle'}
				loadingContent={<Spinner />}
			>
				{(item) => (
					<TableRow key={item.id} className='my-2'>
						<TableCell>{item.company}</TableCell>
						<TableCell>{item.position}</TableCell>
						<TableCell>
							{format(new Date(item.dateApplied), 'MM-dd-yyyy h:mmaaa')}
						</TableCell>
						<TableCell>
							{format(new Date(item.lastUpdated), 'MM-dd-yyyy h:mmaaa')}
						</TableCell>
						<TableCell>
							<p
								className={cn(
									'flex items-center gap-2',
									statusInfo[item.status].color
								)}
							>
								{statusInfo[item.status].icon}
								{statusInfo[item.status].text}
							</p>
						</TableCell>
						<TableCell>
							<Dropdown>
								<DropdownTrigger>
									<Button
										variant='bordered'
										className='min-w-0 p-1 rounded-full aspect-square'
									>
										<MoreVertical size={16} />
									</Button>
								</DropdownTrigger>
								<DropdownMenu>
									<DropdownItem
										key='withdraw'
										color='warning'
										variant='flat'
										className='text-warning'
									>
										Withdraw
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
