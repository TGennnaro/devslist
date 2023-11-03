import { twMerge } from 'tailwind-merge';

export function cn(...args: (string | undefined)[]) {
	return twMerge(...args);
}

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
	const days = Math.floor(
		(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
	);
	let interval = Math.floor(days / 31536000);
	if (interval >= 1)
		return interval + ' year' + (interval > 1 ? 's' : '') + ' ago';
	interval = Math.floor(days / 2592000);
	if (interval >= 1)
		return interval + ' month' + (interval > 1 ? 's' : '') + ' ago';
	interval = Math.floor(days / 86400);
	if (interval >= 1)
		return interval + ' day' + (interval > 1 ? 's' : '') + ' ago';
	return 'Today';
}
