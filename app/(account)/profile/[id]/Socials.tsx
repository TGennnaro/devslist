import { CardBody } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import {
	Facebook,
	Github,
	Instagram,
	Linkedin,
	Twitter,
	Youtube,
} from 'lucide-react';
import { Button } from '@nextui-org/button';

export default function Socials() {
	return (
		<Card>
			<CardBody>
				<div className='mb-3 font-semibold md:text-3xl sm:text-2xl'>
					Socials
				</div>
				<div className='flex flex-col gap-1'>
					<Button color='default' variant='ghost' startContent={<Github />}>
						GitHub
					</Button>
					<Button color='primary' variant='ghost' startContent={<Facebook />}>
						Facebook
					</Button>
					<Button
						color='secondary'
						variant='ghost'
						startContent={<Instagram />}
					>
						Instagram
					</Button>
					<Button color='primary' variant='ghost' startContent={<Linkedin />}>
						LinkedIn
					</Button>
					<Button color='primary' variant='ghost' startContent={<Twitter />}>
						Twitter
					</Button>
					<Button color='danger' variant='ghost' startContent={<Youtube />}>
						YouTube
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}
