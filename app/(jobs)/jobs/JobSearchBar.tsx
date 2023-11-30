import { debounce } from '@/lib/utils';
import { Input } from '@nextui-org/input';
import { FaSearch } from 'react-icons/fa';

export default function JobSearchBar({
	setQuery,
}: {
	setQuery: (query: string) => void;
}) {
	return (
		<Input
			type='email'
			label='Search'
			labelPlacement='outside'
			placeholder='Job title, location, company, skills, ...'
			startContent={<FaSearch />}
			onValueChange={debounce(setQuery, 500)}
		/>
	);
}
