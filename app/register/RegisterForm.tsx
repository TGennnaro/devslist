'use client';

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { useMutation } from 'react-query';
import { FormEvent } from 'react';
import { toast } from 'sonner';

export default function RegisterForm() {
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
		onSuccess: (res) => {
			if (res.status === 200) toast.success('Account created successfully');
			else toast.error('Something went wrong, try again');
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
				<Input className='mt-2' name='password' />
			</div>
			<Button
				color='primary'
				className='w-full mt-6'
				type='submit'
				isLoading={mutation.isLoading}
			>
				Register
			</Button>
		</form>
	);
}
