'use client';
import JobCard, { JobCardSkeleton } from '@/app/(jobs)/jobs/JobCard';
import { title } from '@/components/primitives';
import { Company, Job } from '@/db/schema';
import { authOptions } from '@/lib/auth';
import { currency } from '@/lib/utils';
import { JobFilters } from '@/types';
import { Button } from '@nextui-org/button';
import { Pagination } from '@nextui-org/pagination';
import { Plus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Filters from './Filters';

export default function JobSearch() {
	const [filters, setFilters] = useState<JobFilters>({
		searchQuery: undefined,
		jobTypes: undefined,
	});

	const query = useQuery({
		queryKey: ['jobs', filters],
		queryFn: async () => {
			let query = '?';
			for (const [k, v] of Object.entries(filters)) {
				if (Array.isArray(v) && v.length > 0) query += `${k}=${v.join(',')}&`;
				else if (typeof v === 'string') query += `${k}=${v}&`;
			}
			const res = await fetch(`/api/jobs${query}`);
			if (!res.ok) throw new Error('Network error occurred');
			return res.json();
		},
	});

	return (
		<div className='flex flex-col gap-8 pt-8 md:flex-row'>
			<div className='shrink-0 grow-0'>
				<Filters filters={filters} setFilters={setFilters} />
			</div>
			<div className='w-full'>
				<div className='grid w-full gap-5 md:grid-cols-2 sm:grid-cols-1'>
					{query.isLoading && (
						<>
							{Array.from({ length: 6 }).map((_, i) => (
								<JobCardSkeleton key={i} />
							))}
						</>
					)}
					{query.isSuccess && (
						<>
							{query.data.length > 0 ? (
								query.data.map((listing: { jobs: Job; company: Company }) => {
									return (
										<JobCard
											key={listing.jobs.id}
											id={listing.jobs.id}
											position={listing.jobs.jobTitle}
											company={listing.company.name}
											companyLogo={listing.company.logo ?? null}
											companyRating={4.5}
											postedDate={new Date(listing.jobs.startDate)}
											expirationDate={new Date(
												listing.jobs.endDate
											).toLocaleDateString()}
											location={listing.jobs.address}
											pay={
												listing.jobs.showPayRate
													? currency(
															listing.jobs.salary ??
																listing.jobs.hourlyRate ??
																0
													  ) + (listing.jobs.salary ? ' per year' : ' an hour')
													: null
											}
											jobType={listing.jobs.jobType}
											description={listing.jobs.jobDescription}
										/>
									);
								})
							) : (
								<div>No results found</div>
							)}
						</>
					)}
				</div>
				<div className='flex flex-row items-center justify-center my-52'>
					<Pagination total={5} initialPage={1} />
				</div>
			</div>
		</div>
	);
}
