'use client';

import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function LoginForm() {
	const router = useRouter();
	const pathname = usePathname();
	let searchParams = new URLSearchParams(pathname.split('?')[1]);
	const [isLoading, setIsLoading] = useState(false);
	async function submit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setIsLoading(true);
		const formData = new FormData(e.target as HTMLFormElement);
		signIn('credentials', {
			username: (formData.get('email') as string).toLowerCase(),
			password: formData.get('password') as string,
			redirect: false,
		}).then((res) => {
			if (res?.status === 401) toast.error('Invalid username or password');
			else if (res?.status !== 200) toast.error('An internal error occurred');
			else if (res?.status === 200) {
				if (searchParams !== undefined)
					router.push(searchParams.get('callbackUrl') ?? '/');
			}
			setIsLoading(false);
		});
	}
	return (
		<form onSubmit={submit}>
			<div className='mt-6'>
				<label className='font-medium'>Email address</label>
				<Input className='mt-2' name='email' />
			</div>
			<div className='mt-6'>
				<label className='font-medium'>Password</label>
				<Input className='mt-2' name='password' type='password' />
			</div>
			<Button
				color='primary'
				className='w-full mt-6'
				type='submit'
				isLoading={isLoading}
			>
				Login
			</Button>
		</form>
	);
}
