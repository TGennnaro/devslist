'use client';
import { Education } from '@/db/schema';
import { useState } from 'react';
import { title } from '@/components/primitives';
import NewEducationHistoryButton from './NewEducationHistoryButton';
import EducationHistoryEntry from './EducationHistoryEntry';

export default function EducationHistoryPage({
	educationHistory,
}: {
	educationHistory: Education[];
}) {
	const [history, setHistory] = useState(educationHistory);

	return (
		<>
			<div className='flex items-center justify-between mb-12'>
				<h1 className={title()}>Education History</h1>
				<NewEducationHistoryButton history={history} setHistory={setHistory} />
			</div>
			<hr className='mb-8 border-divider' />
			<div className='flex flex-col gap-4'>
				{history
					.sort((a, b) => {
						if (b.startYear !== a.startYear) {
							return b.startYear - a.startYear;
						} else {
							return b.startMonth - a.startMonth;
						}
					})
					.map((education: Education) => (
						<EducationHistoryEntry key={education.id} education={education} />
					))}
			</div>
		</>
	);
}
