import {
	Input as NextInput,
	Textarea as NextTextarea,
} from '@nextui-org/input';
import {
	AutocompleteProps,
	Autocomplete as NextAutocomplete,
} from '@nextui-org/react';
import { Select as NextSelect } from '@nextui-org/select';
import { extendVariants } from '@nextui-org/system';
import { forwardRef } from 'react';

export const Input = extendVariants(NextInput, {
	variants: {
		variant: {
			flat: {
				inputWrapper: [
					'bg-white',
					'data-[hover=true]:bg-gray-50',
					'data-[focus=true]:bg-white',
					'dark:bg-white/5',
					'dark:data-[hover=true]:bg-white/10',
					'dark:data-[focus=true]:bg-white/5',
					'border',
					'border-border',
				],
			},
		},
	},
	defaultVariants: {
		radius: 'sm',
		variant: 'flat',
	},
});

export const Textarea = extendVariants(NextTextarea, {
	variants: {
		variant: {
			flat: {
				inputWrapper: [
					'bg-white',
					'data-[hover=true]:bg-gray-50',
					'data-[focus=true]:bg-white',
					'dark:bg-white/5',
					'dark:data-[hover=true]:bg-white/10',
					'dark:data-[focus=true]:bg-white/5',
					'border',
					'border-border',
				],
			},
		},
	},
	defaultVariants: {
		radius: 'sm',
		variant: 'flat',
	},
});

const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
	({ radius, variant, ...props }, ref) => {
		return (
			<NextAutocomplete
				radius={radius ?? 'sm'}
				variant={variant ?? 'flat'}
				{...props}
				ref={ref}
				inputProps={{
					classNames: {
						inputWrapper:
							'bg-white data-[hover=true]:bg-gray-50 data-[focus=true]:bg-white dark:bg-white/5 dark:data-[hover=true]:bg-white/10 dark:data-[focus=true]:bg-white/5 border border-border',
					},
				}}
			/>
		);
	}
);
Autocomplete.displayName = 'Autocomplete';
export { Autocomplete };

export const Select = extendVariants(NextSelect, {
	variants: {
		variant: {
			flat: {
				trigger: [
					'bg-white',
					'data-[hover=true]:bg-gray-50',
					'data-[focus=true]:bg-white',
					'dark:bg-white/5',
					'dark:data-[hover=true]:bg-white/10',
					'dark:data-[focus=true]:bg-white/5',
					'border',
					'border-border',
				],
			},
		},
	},
	defaultVariants: {
		radius: 'sm',
		variant: 'flat',
	},
});
