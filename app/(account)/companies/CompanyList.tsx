'use client';

import { Company } from '@/db/schema';
import { Spinner } from '@nextui-org/spinner';
import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import CompanyCard from './CompanyCard';

export default function CompanyList() {
	const session = useSession();
	const { data, isLoading, isError } = useQuery({
		queryKey: ['list_companies', session.data?.user.id],
		queryFn: async () => {
			const res = await fetch(`/api/companies/users/${session.data?.user.id}`);
			if (!res.ok) throw new Error('Network error occurred');
			return res.json();
		},
	});

	if (!session.data?.user || isLoading) {
		return <Spinner size='lg' className='mt-8' />;
	}

	return (
		<ul className='flex flex-col w-full gap-4'>
			{data?.map((company: Company) => (
				<CompanyCard key={company.id} company={company} />
			))}
		</ul>
	);
}
