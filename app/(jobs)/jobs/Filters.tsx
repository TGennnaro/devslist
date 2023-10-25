import { Checkbox } from '@nextui-org/checkbox';
import { Radio, RadioGroup } from '@nextui-org/radio';

export default function Filters() {
	return (
		<div className='flex flex-col gap-8 w-80'>
			<div>
				<label className='block mb-6'>Type</label>
				<ul className='flex flex-col gap-3'>
					<li>
						<Checkbox>Full Time</Checkbox>
					</li>
					<li>
						<Checkbox>Part Time</Checkbox>
					</li>
					<li>
						<Checkbox>Freelance</Checkbox>
					</li>
					<li>
						<Checkbox>Internship</Checkbox>
					</li>
				</ul>
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
