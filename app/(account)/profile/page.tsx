import { title } from '@/components/primitives';
import { cn } from '@/lib/utils';
import ProfileForm from './ProfileForm';
import {
	getAvailableGitHubProjects,
	getDisplayedGitHubProjects,
	getUser,
	getWorkHistory,
	getEducationHistory,
} from '@/lib/server_utils';

export default async function Page() {
	const displayedProjects = await getDisplayedGitHubProjects();
	const availableProjects = await getAvailableGitHubProjects();
	const workHistory = await getWorkHistory();
	const educationHistory = await getEducationHistory();
	return (
		<div>
			<h1 className={cn(title(), 'mb-16 block')}>Profile Settings</h1>
			<hr className='mb-16 border-divider' />
			<ProfileForm
				defaultValues={await getUser()}
				displayedGitHubProjects={displayedProjects || []}
				availableGitHubProjects={availableProjects || []}
				workHistory={workHistory || []}
				educationHistory={educationHistory || []}
			/>
		</div>
	);
}
