'use client';
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@nextui-org/table';
import { Chip } from '@nextui-org/chip';
import { Check, Hourglass, MoreVertical, Undo2, X } from 'lucide-react';
import { Button, ButtonProps } from '@nextui-org/button';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/dropdown';

enum Status {
	PENDING_REVIEW = 'Pending Review',
	ACCEPTED = 'Accepted',
	DISCONTINUED = 'Discontinued',
	WITHDRAWN = 'Withdrawn',
}

const columns = [
	{
		key: 'position',
		name: 'Position',
	},
	{
		key: 'company',
		name: 'Company',
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

const rows = [
	{
		position: 'Software Engineer',
		company: 'Apple, Inc.',
		dateApplied: new Date().toLocaleDateString(),
		lastUpdated: new Date().toLocaleDateString(),
		status: Status.PENDING_REVIEW,
	},
	{
		position: 'Intern',
		company: 'Microsoft Corporation',
		dateApplied: new Date().toLocaleDateString(),
		lastUpdated: new Date().toLocaleDateString(),
		status: Status.ACCEPTED,
	},
	{
		position: 'Software Developer',
		company: 'Microsoft Corporation',
		dateApplied: new Date().toLocaleDateString(),
		lastUpdated: new Date().toLocaleDateString(),
		status: Status.DISCONTINUED,
	},
	{
		position: 'Software Engineer',
		company: 'Apple, Inc.',
		dateApplied: new Date().toLocaleDateString(),
		lastUpdated: new Date().toLocaleDateString(),
		status: Status.WITHDRAWN,
	},
];

const statusColors = {
	[Status.PENDING_REVIEW]: 'primary',
	[Status.ACCEPTED]: 'success',
	[Status.DISCONTINUED]: 'danger',
	[Status.WITHDRAWN]: 'warning',
};

const statusIcons = {
	[Status.PENDING_REVIEW]: <Hourglass size={16} />,
	[Status.ACCEPTED]: <Check size={16} />,
	[Status.DISCONTINUED]: <X size={16} />,
	[Status.WITHDRAWN]: <Undo2 size={16} />,
};

export default function ApplicationsTable() {
	return (
		<Table className='mt-8' aria-label='My applications'>
			<TableHeader columns={columns}>
				{columns.map((column) => (
					<TableColumn key={column.key} className='bg-default-100/50'>
						{column.name}
					</TableColumn>
				))}
			</TableHeader>
			<TableBody items={rows}>
				{(item) => (
					<TableRow key={item.position} className='my-2'>
						<TableCell>{item.position}</TableCell>
						<TableCell>{item.company}</TableCell>
						<TableCell>{item.dateApplied}</TableCell>
						<TableCell>{item.lastUpdated}</TableCell>
						<TableCell>
							<Chip
								color={statusColors[item.status] as ButtonProps['color']}
								variant='light'
								startContent={statusIcons[item.status]}
							>
								{item.status}
							</Chip>
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
