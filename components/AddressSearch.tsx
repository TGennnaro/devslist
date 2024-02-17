'use client';
import { Autocomplete } from '@/components/ui/input';
import { GeoSuggestionResult } from '@/types';
import { AutocompleteItem, AutocompleteProps } from '@nextui-org/react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDebounce } from 'usehooks-ts';

export default function AddressSearch({
	setLocation,
	disabled = false,
	defaultItems,
	items,
	defaultInputValue,
	...props
}: {
	setLocation: (address: string) => void;
	disabled?: boolean;
} & Omit<AutocompleteProps, 'children'>) {
	const [fieldState, setFieldState] = useState({
		selectedKey: '',
		inputValue: defaultInputValue ?? '',
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
			{...props}
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
				setFieldState((prev) => ({
					...prev,
					selectedKey: item?.toString() ?? '',
					inputValue: item?.toString() ?? prev.inputValue,
				}));
				setLocation(item?.toString() ?? '');
			}}
			inputValue={fieldState.inputValue}
			isInvalid={isError}
			isDisabled={disabled}
			description={
				fieldState.selectedKey.length > 0
					? `Selected address: ${fieldState.selectedKey}`
					: ''
			}
			value={fieldState.selectedKey}
		>
			{(item) => (
				// @ts-ignore
				<AutocompleteItem key={item.text}>{item.text}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
