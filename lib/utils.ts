import { twMerge } from 'tailwind-merge';

export function cn(...args: (string | undefined)[]) {
	return twMerge(...args);
}
