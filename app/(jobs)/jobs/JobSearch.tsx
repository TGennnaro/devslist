'use client';
import JobCard, { JobCardSkeleton } from '@/app/(jobs)/jobs/JobCard';
import { Company, Job } from '@/db/schema';
import { currency } from '@/lib/utils';
import { JobFilters } from '@/types';
import { Pagination } from '@nextui-org/pagination';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Filters from './Filters';
import { toast } from 'sonner';

const PER_PAGE = 10;

export default function JobSearch() {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalResults, setTotalResults] = useState(0);

	const [filters, setFilters] = useState<JobFilters>({
		searchQuery: undefined,
		jobTypes: undefined,
	});

	const { isLoading, isError, isSuccess, data, error } = useQuery({
		queryKey: ['jobs', filters, currentPage],
		queryFn: async () => {
			let query = `?page=${currentPage}&per_page=${PER_PAGE}&`;
			for (const [k, v] of Object.entries(filters)) {
				if (Array.isArray(v) && v.length > 0) query += `${k}=${v.join(',')}&`;
				else if (typeof v === 'string') query += `${k}=${v}&`;
			}
			const res = await fetch(`/api/jobs${query}`);
			if (!res.ok) throw new Error('Network error occurred');
			return res.json();
		},
		onError: (err) => {
			console.error(err);
			toast.error('An error occurred. See console for details.');
		},
		onSuccess: (data) => {
			setTotalResults(data.total);
			window.scrollTo(0, 0);
		},
	});

	return (
		<div className='flex flex-col gap-8 pt-8 md:flex-row'>
			<div className='shrink-0 grow-0'>
				<Filters filters={filters} setFilters={setFilters} />
			</div>
			<div className='w-full'>
				<div className='grid w-full gap-5 md:grid-cols-2 sm:grid-cols-1'>
					{isLoading && (
						<>
							{Array.from({ length: PER_PAGE }).map((_, i) => (
								<JobCardSkeleton key={i} />
							))}
						</>
					)}
					{isSuccess && (
						<>
							{data.jobs?.length > 0 ? (
								data.jobs.map((listing: { jobs: Job; company: Company }) => {
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
											skills={listing.jobs.skills as string[]}
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
					<Pagination
						total={
							totalResults && !isNaN(totalResults)
								? Math.ceil(totalResults / PER_PAGE)
								: 1
						}
						page={currentPage}
						onChange={setCurrentPage}
						loop
						showControls
					/>
				</div>
			</div>
		</div>
	);
}
