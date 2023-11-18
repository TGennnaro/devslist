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
import { Check, Loader, Undo2, X } from 'lucide-react';
import { Button } from '@nextui-org/button';

export default function ApplicationsTable() {
	return (
		<Table className='mt-8' aria-label='My applications' isStriped>
			<TableHeader>
				<TableColumn>POSITION</TableColumn>
				<TableColumn>COMPANY</TableColumn>
				<TableColumn>APPLIED</TableColumn>
				<TableColumn>LAST UPDATE</TableColumn>
				<TableColumn>STATUS</TableColumn>
				<TableColumn>ACTIONS</TableColumn>
			</TableHeader>
			<TableBody>
				<TableRow key='1'>
					<TableCell>Software Engineer</TableCell>
					<TableCell>Apple, Inc.</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>
						<Chip color='default' variant='flat' startContent={<Loader />}>
							Pending Review
						</Chip>
					</TableCell>
					<TableCell>
						<Button
							variant='flat'
							color='danger'
							size='sm'
							startContent={<Undo2 />}
						>
							Revoke
						</Button>
					</TableCell>
				</TableRow>
				<TableRow key='2'>
					<TableCell>Intern</TableCell>
					<TableCell>Microsoft Corporation</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>
						<Chip color='success' variant='flat' startContent={<Check />}>
							Accepted
						</Chip>
					</TableCell>
					<TableCell>{null}</TableCell>
				</TableRow>
				<TableRow key='2'>
					<TableCell>Software Developer</TableCell>
					<TableCell>Microsoft Corporation</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>
						<Chip color='danger' variant='flat' startContent={<X />}>
							Rejected
						</Chip>
					</TableCell>
					<TableCell>{null}</TableCell>
				</TableRow>
				<TableRow key='1'>
					<TableCell>Software Engineer</TableCell>
					<TableCell>Apple, Inc.</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>{new Date().toLocaleDateString()}</TableCell>
					<TableCell>
						<Chip color='warning' variant='flat' startContent={<Undo2 />}>
							Revoked
						</Chip>
					</TableCell>
					<TableCell>{null}</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	);
}
