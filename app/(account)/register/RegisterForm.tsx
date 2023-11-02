'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useMutation } from 'react-query';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const mutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const data = new FormData(e.target as HTMLFormElement);
			return fetch('/api/register', {
				method: 'POST',
				body: JSON.stringify({
					firstName: data.get('first-name'),
					lastName: data.get('last-name'),
					email: data.get('email'),
					password: data.get('password'),
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: async (res) => {
			const response = await res.json();
			if (res.status === 200) {
				setIsLoading(true);
				const res = await signIn('credentials', {
					username: response.username,
					password: response.password,
					redirect: false,
				});

				if (res?.status === 401) toast.error('Invalid username or password');
				else if (res?.status !== 200) toast.error('An internal error occurred');
				else if (res?.status === 200) {
					router.push('/');
				}
				setIsLoading(false);
			} else {
				toast.error('Something went wrong, try again');
				console.log(response);
			}
		},
	});
	return (
		<form onSubmit={mutation.mutate}>
			<div className='flex gap-4'>
				<div className='grow'>
					<label className='font-medium'>First name</label>
					<Input className='mt-2' name='first-name' />
				</div>
				<div className='grow'>
					<label className='font-medium'>Last name</label>
					<Input className='mt-2' name='last-name' />
				</div>
			</div>
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
				isLoading={mutation.isLoading || isLoading}
			>
				Register
			</Button>
		</form>
	);
}
