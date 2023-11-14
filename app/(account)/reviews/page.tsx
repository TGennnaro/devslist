import { title } from '@/components/primitives';
import ReviewsTable from './ReviewsTable';

export default function MyReviews() {
	return (
		<>
			<h1 className={title()}>My Reviews</h1>
			<ReviewsTable />
		</>
	);
}
