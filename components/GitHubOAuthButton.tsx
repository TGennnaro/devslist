'use client';
import { Button } from '@nextui-org/button';
import { signIn } from 'next-auth/react';
import { GithubIcon } from 'lucide-react';

export default function GitHubOAuthButton() {
	return (
		<Button
			className='bg-[rgb(36,41,47)] hover:bg-[rgb(52,60,69)] text-white transition-background rounded-md flex gap-3 py-3 mt-6'
			onClick={() => signIn('github', { callbackUrl: '/' })}
			startContent={<GithubIcon />}
		>
			GitHub
		</Button>
	);
}
