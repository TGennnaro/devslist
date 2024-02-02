'use client';

import { Company } from '@/db/schema';
import { Spinner } from '@nextui-org/spinner';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import CompanyCard from './CompanyCard';
import { Pagination } from '@nextui-org/pagination';
import { useState } from 'react';

export default function CompanyList() {
	const session = useSession();
	const [currentPage, setCurrentPage] = useState(1);
	const { data, isLoading, isError } = useQuery({
		queryKey: ['list_companies', session.data?.user.id, currentPage],
		queryFn: async () => {
			const res = await fetch(
				`/api/companies/users/${session.data?.user.id}?page=${currentPage}`
			);
			if (!res.ok) throw new Error('Network error occurred');
			return res.json();
		},
	});

	if (!session.data?.user || isLoading) {
		return <Spinner size='lg' className='mt-8' />;
	}

	return (
		<div className='w-full'>
			<ul className='flex flex-col w-full gap-4'>
				{data?.results.map((company: Company) => (
					<CompanyCard key={company.id} company={company} />
				))}
			</ul>
			<div className='flex justify-center mt-4'>
				<Pagination
					total={Math.ceil(data.total / data.limit) ?? 1}
					page={currentPage}
					onChange={setCurrentPage}
					loop
					showControls
				/>
			</div>
		</div>
	);
}
