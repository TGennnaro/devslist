'use client';
import { Experience } from '@/db/schema';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@nextui-org/select';
import { Select } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from '@nextui-org/modal';
import WorkExperienceEntry from './WorkExperienceEntry';
import { title } from '@/components/primitives';
import NewWorkExperienceButton from './NewWorkExperienceButton';

export default function WorkExperiencePage({
	workHistory,
}: {
	workHistory: Experience[];
}) {
	const [history, setHistory] = useState(workHistory);

	return (
		<>
			<div className='flex items-center justify-between mb-12'>
				<h1 className={title()}>Work Experience</h1>
				<NewWorkExperienceButton history={history} setHistory={setHistory} />
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
					.map((job: Experience) => (
						<WorkExperienceEntry key={job.id} job={job} />
					))}
			</div>
		</>
	);
}
