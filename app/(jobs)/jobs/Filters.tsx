import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { Radio, RadioGroup } from '@nextui-org/radio';
import JobSearchBar from './JobSearchBar';
import { JobFilters } from '@/types';

export default function Filters({
	filters,
	setFilters,
}: {
	filters: JobFilters;
	setFilters: React.Dispatch<React.SetStateAction<JobFilters>>;
}) {
	return (
		<div className='sticky flex flex-col h-[calc(100vh_-_4rem)] gap-8 top-16 w-80 overflow-auto py-8'>
			<div>
				<JobSearchBar
					setQuery={(query: string) =>
						setFilters((prev) => ({ ...prev, searchQuery: query }))
					}
				/>
			</div>
			<hr className='my-4 border-divider' />
			<div>
				<label className='block mb-6'>Type</label>
				<CheckboxGroup
					color='primary'
					value={filters.jobTypes}
					onValueChange={(value: string[]) =>
						setFilters((prev) => ({ ...prev, jobTypes: value }))
					}
				>
					<Checkbox value='Full-Time'>Full-Time</Checkbox>
					<Checkbox value='Part-Time'>Part-Time</Checkbox>
					<Checkbox value='Freelance'>Freelance</Checkbox>
					<Checkbox value='Internship'>Internship</Checkbox>
				</CheckboxGroup>
			</div>
			<hr className='my-4 border-divider' />
			<div className='w-full'>
				<label className='block mb-6'>Salary</label>
				<RadioGroup
					classNames={{
						wrapper: 'flex flex-col gap-3',
					}}
				>
					<Radio value='0'>Less than $40,000</Radio>
					<Radio value='40000'>$40,000+</Radio>
					<Radio value='60000'>$60,000+</Radio>
					<Radio value='80000'>$80,000+</Radio>
					<Radio value='100000'>$100,000+</Radio>
					<Radio value='120000'>$120,000+</Radio>
					<Radio value='140000'>$140,000+</Radio>
				</RadioGroup>
			</div>
		</div>
	);
}
