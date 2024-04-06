'use client';

import { Button } from '@nextui-org/button';
import { Image } from 'lucide-react';
import { useRef, useState } from 'react';
import NextImage from 'next/image';

export default function ImageUpload() {
	const [image, setImage] = useState<File | null>(null);
	const profilePictureRef = useRef<HTMLInputElement>(null);
	return (
		<div className='grid w-full p-8 text-center border border-dashed rounded-lg border-default-400 place-content-center'>
			<input
				name='profilePicture'
				id='profile-picture'
				type='file'
				className='hidden'
				accept='image/png, image/jpeg, image/gif'
				onChange={(e) => setImage(e.target.files?.[0] ?? null)}
				ref={profilePictureRef}
			/>
			{image === null ? (
				<>
					<Image
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
					<p className='text-xs text-gray-700 dark:text-gray-400'>
						PNG, JPG, GIF up to 10MB
					</p>
				</>
			) : (
				<>
					<NextImage
						className='object-cover w-32 h-32 mx-auto mb-6 rounded-full'
						src={URL.createObjectURL(image)}
						alt='Profile picture'
					/>
					<div className='flex items-center gap-4'>
						<Button
							radius='sm'
							onClick={() => {
								setImage(null);
								if (profilePictureRef.current)
									profilePictureRef.current.value = '';
							}}
						>
							Remove image
						</Button>

						<label htmlFor='profile-picture' className='cursor-pointer'>
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
