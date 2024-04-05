import { CardBody, CardHeader } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { Briefcase, Calendar, MapPin, TextQuote } from 'lucide-react';
import { Experience } from '@/db/schema';
import { getMonthNameFromNumber } from '@/lib/utils';

export default function WorkHistory({ history }: { history: Experience[] }) {
	return (
		<Card>
			<CardHeader className='text-3xl font-medium'>Work Experience</CardHeader>
			<CardBody className='flex flex-col gap-3 mb-5'>
				{history.map((job) => (
					<div key={job.id} className='flex flex-row items-center gap-3'>
						<Briefcase size={75} />
						<div className='flex flex-col'>
							<span className='font-bold'>
								{job.position} at {job.company}
							</span>
							<span className='flex items-center gap-1 text-small'>
								<MapPin /> {job.location}
							</span>
							<span className='flex items-center gap-1 text-small'>
								<TextQuote /> {job.description}
							</span>
							{job.startMonth && job.startYear && (
								<span className='flex items-center gap-1 text-small'>
									<Calendar />{' '}
									{getMonthNameFromNumber(job.startMonth) + ' ' + job.startYear}{' '}
									-{' '}
									{job.endMonth && job.endYear
										? getMonthNameFromNumber(job.endMonth) + ' ' + job.endYear
										: 'Present'}
								</span>
							)}
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
