import { FormEvent } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...args: (string | undefined)[]) {
	return twMerge(...args);
}

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

export function timeSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) return interval + ' year' + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) return interval + ' month' + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 86400);
	if (interval >= 1) return interval + ' day' + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 3600);
	if (interval >= 1) return interval + ' hour' + (interval > 1 ? 's' : '');
	interval = Math.floor(seconds / 60);
	if (interval >= 1) return interval + ' minute' + (interval > 1 ? 's' : '');
	return Math.floor(seconds) + ' second' + (interval > 1 ? 's' : '');
}

export function dateSince(date: Date) {
	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1)
		return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1)
		return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
	interval = Math.floor(seconds / 86400);
	if (interval >= 1)
		return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
	if (interval === 0) return 'Today';
}

export function currency(amount: number) {
	return `$${Math.round(amount).toLocaleString()}`;
}

export function parseFormData(e: FormEvent<HTMLFormElement>) {
	e.preventDefault();
	const target = e.target as HTMLFormElement;
	const formData = new FormData(target);
	for (const checkbox of target.querySelectorAll('input[type=checkbox]')) {
		const checkboxInput = checkbox as HTMLInputElement;
		formData.set(checkboxInput.name, checkboxInput.checked.toString());
	}
	return formData;
}
