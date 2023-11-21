'use client';

import { Input, InputProps } from '@nextui-org/input';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import { Calendar } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';

interface DatePickerProps extends InputProps {
	selected?: Date | undefined;
	setSelected?: (date: Date | undefined) => void;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
	({ selected, setSelected, ...props }, ref) => {
		const [isOpen, setIsOpen] = useState<boolean>(false);
		return (
			<Input
				placeholder={selected?.toLocaleDateString()}
				value={selected?.toLocaleDateString()}
				endContent={
					<Popover
						placement='bottom'
						showArrow={true}
						isOpen={isOpen}
						onOpenChange={(open) => setIsOpen(open)}
					>
						<PopoverTrigger>
							<button type='button'>
								<Calendar />
							</button>
						</PopoverTrigger>
						<PopoverContent>
							<div className='px-1 py-2'>
								<DayPicker
									mode='single'
									required
									selected={selected}
									onSelect={setSelected}
									onDayClick={() => setIsOpen(false)}
									classNames={{
										button:
											'hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer',
										day_selected:
											'!bg-primary-500 dark:!bg-primary-300 !text-white',
									}}
								/>
							</div>
						</PopoverContent>
					</Popover>
				}
				ref={ref}
				{...props}
			/>
		);
	}
);
