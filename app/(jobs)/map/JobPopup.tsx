import React from 'react';
import { Chip } from '@nextui-org/chip';
import { Briefcase } from 'lucide-react';
import { Image } from '@nextui-org/image';
import NextLink from 'next/link';
import { Button } from '@nextui-org/button';
import { ChevronRight } from 'lucide-react';
import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
} from '@nextui-org/table';

const jobTypes: { [key: string]: { color: string; label: string } } = {
	'Full-Time': {
		color:
			'text-blue-600 dark:text-blue-300 bg-blue-300/30 dark:bg-blue-600/30',
		label: 'Full Time',
	},
	'Part-Time': {
		color:
			'text-purple-600 dark:text-purple-300 bg-purple-300/30 dark:bg-purple-600/30',
		label: 'Part Time',
	},
	Internship: {
		color:
			'text-green-600 dark:text-green-300 bg-green-300/30 dark:bg-green-600/30',
		label: 'Internship',
	},
	Freelance: {
		color:
			'text-pink-600 dark:text-pink-300 bg-pink-300/30 dark:bg-pink-600/30',
		label: 'Freelance',
	},
};

export class JobPopup extends React.Component<{
	id: number;
	position: string;
	company: string;
	companyLogo?: string | null;
	location: string;
	jobType: string;
	pay?: string | null;
}> {
	render() {
		const { id, position, company, companyLogo, location, jobType, pay } =
			this.props;
		return (
			<Table hideHeader isStriped aria-label='Job posting data'>
				<TableHeader>
					<TableColumn>PLACEHOLDER</TableColumn>
					<TableColumn>PLACEHOLDER</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow key='1'>
						<TableCell className='font-semibold'>Job Title</TableCell>
						<TableCell>{position}</TableCell>
					</TableRow>
					<TableRow key='2'>
						<TableCell className='font-semibold'>Company</TableCell>
						<TableCell>
							<div className='flex flex-row gap-2 items-center'>
								{companyLogo ? (
									<Image
										isBlurred
										alt='Company logo'
										height={20}
										radius='sm'
										src={companyLogo}
										width={20}
										className='object-contain aspect-square'
									/>
								) : null}
								{company}
							</div>
						</TableCell>
					</TableRow>
					<TableRow key='3'>
						<TableCell className='font-semibold'>Location</TableCell>
						<TableCell>{location}</TableCell>
					</TableRow>
					<TableRow key='4'>
						<TableCell className='font-semibold'>Pay</TableCell>
						<TableCell>{pay}</TableCell>
					</TableRow>
					<TableRow key='5'>
						<TableCell className='font-semibold'>Job Type</TableCell>
						<TableCell>
							<Chip
								className={jobTypes[jobType].color}
								startContent={<Briefcase size={16} className='ml-1' />}
							>
								{jobTypes[jobType].label}
							</Chip>
						</TableCell>
					</TableRow>
					<TableRow key='7'>
						<TableCell className='font-semibold'>Interested?</TableCell>
						<TableCell>
							<Button
								as={NextLink}
								size='sm'
								color='default'
								endContent={<ChevronRight size={16} />}
								href={`/jobs/${id}`}
							>
								View Job
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		);
	}
}
