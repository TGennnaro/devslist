import { title } from '@/components/primitives';
import { cn } from '@/lib/utils';
import ProfileForm from './ProfileForm';
import { getUser } from '@/lib/server_utils';

export default async function Page() {
	return (
		<div>
			<h1 className={cn(title(), 'mb-16 block')}>Profile information</h1>
			<hr className='mb-16 border-divider' />
			<ProfileForm defaultValues={await getUser()} />
		</div>
	);
}
