import { title } from '@/components/primitives';
import ApplicationsTable from './ApplicationsTable';

export default function MyApplications() {
	return (
		<>
			<h1 className={title()}>My Applications</h1>
			<ApplicationsTable />
		</>
	);
}
