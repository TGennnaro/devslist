import { title } from '@/components/primitives';
import { authOptions } from '@/lib/auth';
import { getCompaniesByUser } from '@/lib/models/company';
import { Image } from '@nextui-org/image';
import { Building2 } from 'lucide-react';
import { getServerSession } from 'next-auth';
import NewCompanyButton from './NewCompanyButton';
import { Card } from '@/components/ui/card';
import { CardBody } from '@nextui-org/card';
import OptionsButton from '@/components/OptionsButton';

export default async function Page() {
	const session = await getServerSession(authOptions);
	const user = session?.user;
	if (!user) {
		return <div>Not logged in</div>;
	}
	const companies = await getCompaniesByUser(user.id, true);
	return (
		<>
			<div className='flex items-center justify-between mb-12'>
				<h1 className={title()}>My Companies</h1>
				<NewCompanyButton />
			</div>
			<div>
				<ul className='flex flex-col gap-4'>
					{companies.map((company) => (
						<li key={company.id}>
							<Card>
								<CardBody className='flex flex-row items-center gap-8 p-4'>
									{company.logo ? (
										<Image
											isBlurred
											alt='Company logo'
											height={40}
											radius='sm'
											src={company.logo}
											width={40}
											className='object-contain aspect-square'
										/>
									) : (
										<div className='grid w-10 rounded-lg aspect-square bg-content2 place-content-center'>
											<Building2 size={24} className='text-content4' />
										</div>
									)}
									<span className='text-xl font-medium'>{company.name}</span>
									<OptionsButton
										className='ml-auto'
										options={[
											{
												label: 'View applications',
											},
											{
												label: 'Edit',
											},
											{
												label: 'Delete',
												color: 'danger',
												className: 'text-danger',
											},
										]}
									/>
								</CardBody>
							</Card>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
