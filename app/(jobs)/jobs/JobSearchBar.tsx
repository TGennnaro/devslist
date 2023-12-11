import { debounce } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FaSearch } from 'react-icons/fa';

export default function JobSearchBar({
	setQuery,
}: {
	setQuery: (query: string) => void;
}) {
	return (
		<Input
			label='Search'
			labelPlacement='outside'
			placeholder='Job title, location, company, skills, ...'
			startContent={
				<FaSearch size={16} className='mr-2 text-gray-400 dark:text-gray-600' />
			}
			onValueChange={debounce(setQuery, 500)}
		/>
	);
}
