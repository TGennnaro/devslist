'use client';

import { Logo } from '@/components/icons';
import { ThemeSwitch } from '@/components/theme-switch';
import { siteConfig } from '@/config/site';
import { Avatar } from '@nextui-org/avatar';
import { Badge } from '@nextui-org/badge';
import { Button } from '@nextui-org/button';
import { Divider } from '@nextui-org/divider';
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from '@nextui-org/dropdown';
import { Link } from '@nextui-org/link';
import {
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
	Navbar as NextUINavbar,
} from '@nextui-org/navbar';
import { Skeleton } from '@nextui-org/skeleton';
import { Mail } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const Navbar = () => {
	const session = useSession();
	const [isScrolled, setIsScrolled] = useState(false);
	useEffect(() => {
		window.addEventListener('scroll', () => {
			setIsScrolled(window.scrollY > 1);
		});
	});
	const pathname = usePathname();
	return (
		<NextUINavbar
			maxWidth='xl'
			position='sticky'
			shouldHideOnScroll={false}
			className={`border-b transition-all ${
				isScrolled
					? 'border-gray-300 dark:border-gray-800 shadow-lg'
					: 'border-background'
			}`}
		>
			<NavbarContent justify='start'>
				<NavbarBrand as='li' className='gap-3 max-w-fit'>
					<NextLink className='flex items-center justify-start gap-1' href='/'>
						<Logo />
						<p className='font-bold text-inherit'>DevsList</p>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className='basis-1/5 sm:basis-full' justify='center'>
				<ul className='justify-start hidden gap-2 ml-6 sm:flex'>
					{siteConfig.navItems.map((item) => (
						<NavbarItem
							key={item.href}
							className='border-gray-500 rounded-md dark:hover:bg-white/5 hover:bg-black/5 dark:[&:hover>a]:text-white [&:hover>a]:text-black [&[data-active=true]>a]:text-primary [&[data-active=true]>a]:bg-primary/10 overflow-hidden'
							isActive={pathname.startsWith(item.href)}
						>
							<NextLink
								className='inline-flex px-3 py-2 font-medium text-default-600'
								href={item.href}
							>
								{item.label}
							</NextLink>
						</NavbarItem>
					))}
				</ul>
			</NavbarContent>

			<NavbarContent
				className='hidden sm:flex basis-1/5 sm:basis-full'
				justify='end'
			>
				<NavbarItem className='hidden gap-2 sm:flex'>
					<ThemeSwitch />
				</NavbarItem>

				{session.status === 'loading' && (
					<NavbarItem className='flex items-center gap-2'>
						<Skeleton className='w-8 h-8 rounded-md' />
						<Skeleton className='w-10 h-10 rounded-full' />
					</NavbarItem>
				)}
				{session.status === 'authenticated' && (
					<>
						<Badge color='danger' content={50} shape='circle' size='sm'>
							<NextLink href='#'>
								<Mail size={25} />
							</NextLink>
						</Badge>

						<Dropdown placement='bottom-end'>
							<DropdownTrigger>
								<Avatar
									isBordered
									as='button'
									className='transition-transform'
									color='primary'
									name='User'
									size='sm'
									src='https://i.pravatar.cc/150?u=a'
								/>
							</DropdownTrigger>
							<DropdownMenu aria-label='User Actions' variant='flat'>
								<DropdownItem>
									<p className='font-semibold'>Signed in as</p>
									<p className='font-semibold'>{session.data.user?.email}</p>
								</DropdownItem>
								<DropdownItem as={NextLink} href='/profile'>
									Profile
								</DropdownItem>
								<DropdownItem>Applications</DropdownItem>
								<DropdownItem>Reviews</DropdownItem>
								<DropdownItem showDivider>Settings</DropdownItem>
								<DropdownItem
									color='danger'
									onClick={() => signOut({ callbackUrl: '/' })}
								>
									Log Out
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</>
				)}
				{session.status === 'unauthenticated' && (
					<NavbarItem>
						<Button color='primary' variant='flat' onClick={() => signIn()}>
							Sign In
						</Button>
					</NavbarItem>
				)}
			</NavbarContent>

			<NavbarContent className='pl-4 sm:hidden basis-1' justify='end'>
				<ThemeSwitch />
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarMenu>
				<div className='flex flex-col gap-2 mx-4 mt-2'>
					{siteConfig.navMenuItems.map((item, index) => (
						<NavbarMenuItem key={`${item}-${index}`}>
							<Link color='foreground' href={item.href} size='lg'>
								{item.label}
							</Link>
						</NavbarMenuItem>
					))}
					<Divider />
					{session.status === 'authenticated' ? (
						<>
							<NavbarMenuItem>
								<span className='font-semibold'>
									{session.data.user?.email}
								</span>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link color='foreground' href='#' size='lg'>
									Profile
								</Link>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link color='foreground' href='#' size='lg'>
									Applications
								</Link>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link color='foreground' href='#' size='lg'>
									Reviews
								</Link>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link color='foreground' href='#' size='lg'>
									Settings
								</Link>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link
									color='danger'
									href='#'
									onClick={() => signOut({ callbackUrl: '/' })}
									size='lg'
								>
									Log Out
								</Link>
							</NavbarMenuItem>
						</>
					) : (
						<>
							<NavbarMenuItem>
								<Link color='primary' href='/login' size='lg'>
									Sign In
								</Link>
							</NavbarMenuItem>
							<NavbarMenuItem>
								<Link color='primary' href='/register' size='lg'>
									Register
								</Link>
							</NavbarMenuItem>
						</>
					)}
				</div>
			</NavbarMenu>
		</NextUINavbar>
	);
};
