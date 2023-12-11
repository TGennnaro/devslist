import { title } from '@/components/primitives';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import NewCompanyButton from './NewCompanyButton';
import CompanyList from './CompanyList';

export default async function Page() {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) {
		return <div>Not logged in</div>;
	}
	return (
		<>
			<div className='flex items-center justify-between mb-12'>
				<h1 className={title()}>My Companies</h1>
				<NewCompanyButton />
			</div>
			<div className='flex justify-center'>
				<CompanyList />
			</div>
		</>
	);
}
