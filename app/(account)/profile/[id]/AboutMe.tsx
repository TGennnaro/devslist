import { CardBody, CardHeader } from '@nextui-org/card';
import { Card } from '@/components/ui/card';

export default function AboutMe({ bio }: { bio: string }) {
	return (
		<Card>
			<CardHeader>
				<div className='text-3xl font-medium'>About Me</div>
			</CardHeader>
			<CardBody>{bio}</CardBody>
		</Card>
	);
}
