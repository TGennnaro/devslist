'use client';
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
import { useQuery } from 'react-query';
import { Company, Job } from '@/db/schema';
import { currency } from '@/lib/utils';

const jobTypes: { [key: string]: { color: string; label: string } } = {
	Other: {
		color:
			'text-gray-600 dark:text-gray-300 bg-gray-300/30 dark:bg-gray-600/30',
		label: 'Other',
	},
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

export default function JobPopup({ id }: { id: number }) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ['job_details', id],
		queryFn: async () => {
			const res = await fetch('/api/map?id=' + id);
			if (!res.ok) throw new Error('Network error occurred');
			return (await res.json()) as { jobs: Job; company: Company };
		},
	});

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Error loading job details</p>;
	if (data) {
		return (
			<Table
				hideHeader
				isStriped
				removeWrapper
				aria-label='Job posting details'
			>
				<TableHeader>
					<TableColumn>Field</TableColumn>
					<TableColumn>Value</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow key='1'>
						<TableCell className='font-semibold'>Job Title</TableCell>
						<TableCell>{data.jobs.jobTitle}</TableCell>
					</TableRow>
					<TableRow key='2'>
						<TableCell className='font-semibold'>Company</TableCell>
						<TableCell>
							<div className='flex flex-row gap-2 items-center'>
								{data.company.logo ? (
									<Image
										isBlurred
										alt='Company logo'
										height={20}
										radius='sm'
										src={data.company.logo}
										width={20}
										className='object-contain aspect-square'
									/>
								) : null}
								{data.company.name}
							</div>
						</TableCell>
					</TableRow>
					<TableRow key='3'>
						<TableCell className='font-semibold'>Location</TableCell>
						<TableCell>{data.jobs.address}</TableCell>
					</TableRow>
					<TableRow key='4'>
						<TableCell className='font-semibold'>Pay</TableCell>
						<TableCell>
							{data.jobs.showPayRate
								? currency(
										Number(data.jobs.salary ?? data.jobs.hourlyRate ?? 0)
								  ) + (data.jobs.salary ? ' per year' : ' an hour')
								: 'Not specified'}
						</TableCell>
					</TableRow>
					<TableRow key='5'>
						<TableCell className='font-semibold'>Job Type</TableCell>
						<TableCell>
							{data.jobs.jobType && (
								<Chip
									className={jobTypes[data.jobs.jobType].color}
									startContent={<Briefcase size={16} className='ml-1' />}
								>
									{jobTypes[data.jobs.jobType].label}
								</Chip>
							)}
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
								target='_BLANK'
							>
								View Job
							</Button>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		);
	}

	return <p>No details</p>;
}
