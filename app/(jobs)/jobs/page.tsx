import { title } from '@/components/primitives';
import { authOptions } from '@/lib/auth';
import { Button } from '@nextui-org/button';
import { Plus } from 'lucide-react';
import { getServerSession } from 'next-auth';
import JobSearch from './JobSearch';
import { Metadata } from 'next';
import { getUser } from '@/lib/server_utils';

export const metadata: Metadata = {
	title: 'Jobs',
	description: 'Find your next job',
};

export default async function Jobs() {
	const user = await getUser();
	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className={title()}>Jobs</h1>
				{user?.isEmployer && (
					<Button color='primary' startContent={<Plus size={16} />}>
						Post Job
					</Button>
				)}
			</div>
			<JobSearch />
		</>
	);
}
