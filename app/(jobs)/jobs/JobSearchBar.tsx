import { Input } from '@nextui-org/input';
import { FaSearch } from 'react-icons/fa';

export const debounce = <F extends (...args: any[]) => any>(
	func: F,
	waitFor: number
) => {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<F>): Promise<ReturnType<F>> =>
		new Promise((resolve) => {
			if (timeout) {
				clearTimeout(timeout);
			}
			timeout = setTimeout(() => resolve(func(...args)), waitFor);
		});
};

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
