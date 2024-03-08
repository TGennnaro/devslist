import { getWorkHistory } from '@/lib/server_utils';
import WorkExperiencePage from './WorkExperiencePage';

export default async function Page() {
	const workHistory = await getWorkHistory();
	return (
		<div>
			<WorkExperiencePage workHistory={workHistory || []} />
		</div>
	);
}
