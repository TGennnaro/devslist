'use client';
import { debounce } from '@/lib/utils';
import { GeoSuggestionResult, GeocodeResult } from '@/types';
import Search from '@arcgis/core/widgets/Search';
import { Input } from '@nextui-org/input';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'usehooks-ts';

export default function AddressSearch({
	setLatitude,
	setLongitude,
	setWorkLocation,
	disabled,
}: {
	setLatitude: any;
	setLongitude: any;
	setWorkLocation: any;
	disabled: boolean;
}) {
	const [fieldState, setFieldState] = useState({
		selectedKey: '',
		inputValue: '',
		isLoading: false,
	});
	const debouncedAddress = useDebounce(fieldState.inputValue, 500);
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ['address', debouncedAddress],
		queryFn: async () => {
			if (fieldState.inputValue.length === 0) return;
			const res = await fetch(
				'/api/address/search?query=' + fieldState.inputValue
			);
			if (!res.ok) throw new Error('Network error occurred');
			return res.json() as Promise<GeoSuggestionResult>;
		},
		onSettled: () => {
			setFieldState((prev) => ({ ...prev, isLoading: false }));
		},
	});
	return (
		<Autocomplete
			label='Job location'
			labelPlacement='outside'
			variant='bordered'
			radius='sm'
			placeholder='Search for an address'
			isLoading={isLoading || fieldState.isLoading}
			defaultItems={data?.suggestions ?? []}
			onInputChange={(value) => {
				setFieldState((prev) => ({
					...prev,
					inputValue: value,
					isLoading: true,
				}));
			}}
			defaultFilter={() => true}
			selectedKey={fieldState.selectedKey}
			onSelectionChange={(item) => {
				const suggestion = data?.suggestions.find(
					(suggestion) => suggestion.magicKey === item
				);
				setFieldState((prev) => ({
					...prev,
					selectedKey: suggestion?.text ?? prev.selectedKey,
					inputValue: suggestion?.text ?? prev.inputValue,
				}));
			}}
			inputValue={fieldState.inputValue}
			isInvalid={isError}
			classNames={{
				base: 'max-w-xl',
			}}
			isDisabled={disabled}
		>
			{(item) => (
				<AutocompleteItem key={item.magicKey}>{item.text}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
