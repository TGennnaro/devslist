import { Checkbox, CheckboxGroup } from '@nextui-org/checkbox';
import { Radio, RadioGroup } from '@nextui-org/radio';
import JobSearchBar from './JobSearchBar';

export default function Filters({
	setSearchQuery,
	selectedJobTypes,
	setSelectedJobTypes,
}: {
	setSearchQuery: any;
	selectedJobTypes: any;
	setSelectedJobTypes: any;
}) {
	return (
		<div className='sticky flex flex-col h-[calc(100vh_-_4rem)] gap-8 top-16 w-80 overflow-auto py-8'>
			<div>
				<JobSearchBar setSearchQuery={setSearchQuery} />
			</div>
			<hr className='my-4 border-divider' />
			<div>
				<label className='block mb-6'>Type</label>
				<CheckboxGroup
					color='primary'
					value={selectedJobTypes}
					onValueChange={setSelectedJobTypes}
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
