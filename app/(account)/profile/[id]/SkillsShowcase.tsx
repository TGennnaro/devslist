import { CardBody, CardHeader } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { Chip } from '@nextui-org/chip';

export default function SkillsShowcase({ skills }: { skills: string[] }) {
	return (
		<Card>
			<CardHeader className='text-3xl font-medium'>Skills</CardHeader>
			<CardBody className='flex flex-row flex-wrap gap-1'>
				{skills.map((skill) => {
					return (
						<Chip key={skill} color='default' variant='faded'>
							{skill}
						</Chip>
					);
				})}
			</CardBody>
		</Card>
	);
}
