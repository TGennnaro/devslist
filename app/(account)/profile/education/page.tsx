import { getEducationHistory } from '@/lib/server_utils';
import EducationHistoryPage from './EducationHistoryPage';

export default async function Page() {
	const educationHistory = await getEducationHistory();
	return (
		<div>
			<EducationHistoryPage educationHistory={educationHistory || []} />
		</div>
	);
}
