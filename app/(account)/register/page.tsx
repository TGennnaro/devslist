import { title } from '@/components/primitives';
import { Card } from '@/components/ui/card';
import { CardBody } from '@nextui-org/card';
import RegisterForm from './RegisterForm';
import Link from 'next/link';
import GlowCircle from '@/components/GlowCircle';
import GitHubOAuthButton from '@/components/GitHubOAuthButton';

export default function Page() {
	return (
		<section>
			<GlowCircle top={20} left={35} percent color='secondary' />
			<div className='text-center'>
				<h2 className={title({ size: 'sm' })}>Register an account</h2>
			</div>
			<Card className='max-w-lg mx-auto mt-10'>
				<CardBody className='p-12'>
					<RegisterForm />
					<div className='mt-6 text-center'>
						<span className='dark:text-default-800'>
							Already have an account?{' '}
						</span>
						<Link
							className='font-medium text-primary hover:underline'
							href='/login'
						>
							Login
						</Link>
					</div>
					<div className='relative mt-6'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-divider' />
						</div>
						<div className='relative text-center'>
							<span className='px-6 font-medium bg-content1'>
								Or continue with
							</span>
						</div>
					</div>
					<GitHubOAuthButton />
				</CardBody>
			</Card>
		</section>
	);
}
