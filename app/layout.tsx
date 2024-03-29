import '@/styles/globals.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import { Toaster } from 'sonner';
import { db } from '@/db';
import { Messages } from '@/db/schema';
import { getUser } from '@/lib/server_utils';
import { and, eq } from 'drizzle-orm';

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
	},
};

// export const viewport = {
// 	themeColor: [
// 		{ media: '(prefers-color-scheme: light)', color: 'white' },
// 		{ media: '(prefers-color-scheme: dark)', color: 'black' },
// 	],
// };

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	const numUnread = user
		? (
				await db
					.select()
					.from(Messages)
					.where(and(eq(Messages.toId, user.id), eq(Messages.isOpened, 0)))
		  ).length
		: 0;

	return (
		<html lang='en' suppressHydrationWarning>
			<head />
			<body
				className={clsx(
					'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
					fontSans.variable
				)}
			>
				<Providers
					themeProps={{ attribute: 'class', defaultTheme: 'dark' }}
					unread={numUnread}
				>
					<div className='relative flex flex-col min-h-screen'>
						<Navbar />
						<main className='container flex-grow px-6 pt-16 mx-auto mb-16 max-w-7xl'>
							{children}
						</main>
						<footer className='flex items-center justify-center w-full py-3 text-sm text-light'>
							Copyright © {new Date().getFullYear()} DevsList
							<span className='mx-2'>·</span>
							<Link
								href='https://github.com/TGennnaro/devslist'
								target='_blank'
								className='text-sm underline text-light'
							>
								Source code
							</Link>
						</footer>
					</div>
					<Toaster richColors />
				</Providers>
			</body>
		</html>
	);
}
