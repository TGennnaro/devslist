export { default } from 'next-auth/middleware';

export const config = {
	matcher: [
		'/jobs/:path*',
		'/user/:path*',
		'/map',
		'/applications',
		'/profile',
		'/reviews',
		'/api/:path*',
	],
};
