import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import { getMapEligibleJobs } from '@/lib/server_utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
	title: 'Job Map',
	description: 'Find your next job',
};

// @arcgis/core does not currently work with SSR, so we need to disable it for the map component
const JobMapNoSSR = dynamic(() => import('@/app/(jobs)/map/JobMap'), {
	ssr: false,
});

export default async function Map() {
	// Calling getServerSession() forces this route to render at request time (ensuring up-to-date jobs on map)
	// https://nextjs.org/docs/app/building-your-application/rendering/server-components
	const session = await getServerSession(authOptions);

	return (
		<div className='h-[100vh]'>
			<JobMapNoSSR jobs={await getMapEligibleJobs()} />
		</div>
	);
}
