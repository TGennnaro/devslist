export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: 'DevsList',
	description: 'The all-in-one jobs platform for developers and employers.',
	navItems: [
		{
			label: 'Jobs',
			href: '/jobs',
		},
		{
			label: 'Map',
			href: '/map',
		},
	],
	navMenuItems: [
		{
			label: 'Home',
			href: '/',
		},
		{
			label: 'Jobs',
			href: '/jobs',
		},
		{
			label: 'Job Map',
			href: '/map',
		},
	],
};
