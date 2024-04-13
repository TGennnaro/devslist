'use client';

import { Button } from '@nextui-org/button';
import { File } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function DocumentUpload({
	name,
	subText,
	fileType,
}: {
	name: string;
	subText: string;
	fileType: string;
}) {
	const [document, setDocument] = useState<File | null>(null);
	const documentRef = useRef<HTMLInputElement>(null);
	return (
		<div className='grid w-full p-8 text-center border border-dashed rounded-lg border-default-400 place-content-center'>
			<input
				name={name}
				id={name}
				type='file'
				className='hidden'
				accept={fileType}
				onChange={(e) => setDocument(e.target.files?.[0] ?? null)}
				ref={documentRef}
			/>
			{document === null ? (
				<>
					<File
						className='mx-auto mb-6 text-gray-700 dark:text-gray-400'
						size={72}
						strokeWidth={1}
					/>
					<div className='mb-3'>
						<label htmlFor='profile-picture'>
							<span className='font-semibold cursor-pointer text-primary'>
								Upload a file
							</span>
						</label>
						<p className='inline'> or drag and drop</p>
					</div>
					<p className='text-xs text-gray-700 dark:text-gray-400'>{subText}</p>
				</>
			) : (
				<>
					<Image
						className='object-cover w-32 h-32 mx-auto mb-6 rounded-full'
						src={URL.createObjectURL(document)}
						alt='Profile picture'
					/>
					<div className='flex items-center gap-4'>
						<Button
							radius='sm'
							onClick={() => {
								setDocument(null);
								if (documentRef.current) documentRef.current.value = '';
							}}
						>
							Remove image
						</Button>

						<label htmlFor={name} className='cursor-pointer'>
							<Button
								className='pointer-events-none'
								radius='sm'
								color='primary'
							>
								Upload new image
							</Button>
						</label>
					</div>
				</>
			)}
		</div>
	);
}
