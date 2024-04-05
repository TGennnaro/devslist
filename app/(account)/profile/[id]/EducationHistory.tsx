import { CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import {
	Calculator,
	Calendar,
	GraduationCap,
	MapPin,
	Scroll,
} from 'lucide-react';
import { Education } from '@/db/schema';
import { getMonthNameFromNumber } from '@/lib/utils';

export default function EducationHistory({
	history,
}: {
	history: Education[];
}) {
	return (
		<Card>
			<CardHeader className='text-3xl font-medium'>
				Education History
			</CardHeader>
			<CardBody>
				{history.map((education) => (
					<div className='flex flex-col gap-3 mb-5' key={education.id}>
						<div className='flex flex-row items-center gap-3'>
							<GraduationCap size={75} />
							<div className='flex flex-col'>
								<span className='font-bold'>{education.schoolName}</span>
								{education.location && (
									<span className='flex items-center gap-1 text-small'>
										<MapPin /> {education.location}
									</span>
								)}
								<span className='flex items-center gap-1 text-small'>
									<Scroll /> {education.degree}
								</span>
								{education.gpa && (
									<span className='flex items-center gap-1 text-small'>
										<Calculator /> {education.gpa} GPA
									</span>
								)}
								{education.startMonth && education.startYear && (
									<span className='flex items-center gap-1 text-small'>
										<Calendar />{' '}
										{getMonthNameFromNumber(education.startMonth) +
											' ' +
											education.startYear}{' '}
										-{' '}
										{education.endMonth && education.endYear
											? getMonthNameFromNumber(education.endMonth) +
											  ' ' +
											  education.endYear
											: 'Present'}
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
