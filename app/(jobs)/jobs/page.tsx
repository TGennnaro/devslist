'use client';
import { title } from '@/components/primitives';
import { useEffect, useState } from 'react';
import JobCard from '@/app/(jobs)/jobs/JobCard';
import { Pagination } from '@nextui-org/pagination';
import { Metadata } from 'next';
import Filters from './Filters';
import { Company, Job } from '@/db/schema';

// export const metadata: Metadata = {
//   title: 'Jobs',
//   description: 'Find your next job',
// };

export default function Jobs() {
	const [jobs, setJobs] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedJobTypes, setSelectedJobTypes] = useState([]);

	const fetchJobs = async () => {
		const jobs = await fetch('/api/jobs');
		const data = await jobs.json();
		setJobs(data);
		console.log(data);
	};

	const filterJobs = (searchQuery: string, selectedJobTypes: string[]) => {
		return jobs.filter((listing: { jobs: Job; company: Company }) => {
			const matchesSearchQuery =
				listing.jobs.jobTitle
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				listing.jobs.address
					?.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				listing.jobs.jobRequirements
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				listing.company.name
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				(listing.jobs.skills as string[]).some((skill: string) =>
					skill.toLowerCase().includes(searchQuery.toLowerCase())
				);

			console.log(selectedJobTypes.length);

			const matchesSelectedJobTypes =
				selectedJobTypes.length === 0 ||
				selectedJobTypes.some((jobType: string) =>
					listing.jobs.jobType.includes(jobType)
				);

			return matchesSearchQuery && matchesSelectedJobTypes;
		});
	};

	const filteredJobs = filterJobs(searchQuery, selectedJobTypes);

	useEffect(() => {
		fetchJobs();
	}, []);

	return (
		<>
			<h1 className={title()}>Jobs</h1>

			<div className='flex flex-col gap-8 pt-8 md:flex-row'>
				<div className='shrink-0 grow-0'>
					<Filters
						setSearchQuery={setSearchQuery}
						selectedJobTypes={selectedJobTypes}
						setSelectedJobTypes={setSelectedJobTypes}
					/>
				</div>
				<div>
					<div className='grid w-full gap-5 md:grid-cols-2 sm:grid-cols-1'>
						{filteredJobs.length > 0 ? (
							filteredJobs.map((listing: { jobs: Job; company: Company }) => {
								return (
									<JobCard
										key={listing.jobs.id}
										id={listing.jobs.id}
										position={listing.jobs.jobTitle}
										company={listing.company.name}
										companyLogo='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png'
										companyRating={4.5}
										postedDate={new Date(listing.jobs.startDate)}
										expirationDate={new Date(
											listing.jobs.endDate
										).toLocaleDateString()}
										location={listing.jobs.address}
										pay={
											listing.jobs.showPayRate
												? listing.jobs.salary
													? '$' + listing.jobs.salary + '/year'
													: '$' + listing.jobs.hourlyRate + '/hour'
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
					</div>
					<div className='flex flex-row items-center justify-center my-52'>
						<Pagination total={5} initialPage={1} />
					</div>
				</div>
			</div>
		</>
	);
}
