import AddressSearch from '@/components/AddressSearch';
import { Input, Textarea } from '@/components/ui/input';
import { Company } from '@/db/schema';
import { useState } from 'react';

export default function CompanyForm({
	defaultValues,
}: {
	defaultValues?: Company;
}) {
	const [location, setLocation] = useState('');
	return (
		<>
			<Input
				name='companyName'
				label='Name'
				labelPlacement='outside'
				placeholder='Enter the company name'
				defaultValue={defaultValues?.name}
			/>
			<Textarea
				name='companyDescription'
				label='Description'
				labelPlacement='outside'
				placeholder='Describe your company'
				minRows={5}
				rows={5}
				defaultValue={defaultValues?.description}
			/>
			<AddressSearch
				setLocation={setLocation}
				placeholder='Search an address...'
				label='Address'
				labelPlacement='outside'
				name='companyAddress'
				value={location === '' ? defaultValues?.address : location}
				defaultInputValue={defaultValues?.address}
			/>
			<Input
				name='companyUrl'
				label='Website'
				placeholder="Enter the company's website"
				labelPlacement='outside'
				defaultValue={defaultValues?.url ?? ''}
			/>
		</>
	);
}
