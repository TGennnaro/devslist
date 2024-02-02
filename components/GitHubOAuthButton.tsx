'use client';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';
import { GithubIcon } from 'lucide-react';

export default function GitHubOAuthButton() {
	return (
		<Button
			className='flex gap-3 py-3 mt-6 text-white rounded-md bg-white/5 hover:bg-white/10 transition-background'
			onClick={() => signIn('github', { callbackUrl: '/' })}
			startContent={<GithubIcon />}
		>
			GitHub
		</Button>
	);
}
