'use client';

import Text from '@/components/Text';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { Input, Textarea } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { Plus } from 'lucide-react';
import { FormEvent, useRef } from 'react';
import ImageUpload from './ImageUpload';
import { useMutation } from 'react-query';

export default function ProfileForm() {
	const mutation = useMutation({
		mutationFn: (e: FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			const formData = new FormData(e.target as HTMLFormElement);
			return fetch('/api/profile', {
				method: 'POST',
				body: formData,
			});
		},
	});
	return (
		<form className='flex flex-col gap-24 mb-32' onSubmit={mutation.mutate}>
			<div className='grid grid-cols-12 gap-x-16'>
				<div className='col-span-4'>
					<span className='block mb-1 text-xl font-semibold leading-normal'>
						Profile
					</span>
					<Text variant='body' className='text-md'>
						This information will be displayed publicly on your profile.
					</Text>
				</div>
				<div className='flex flex-col col-span-8 gap-8'>
					<Checkbox name='employer'>I am an employer</Checkbox>
					<Textarea
						name='about'
						label='About'
						labelPlacement='outside'
						placeholder='Write a few sentences about yourself'
						variant='bordered'
						radius='sm'
						minRows={4}
					/>
					<div className=''>
						<Input
							name='website-1'
							label='Website'
							labelPlacement='outside'
							startContent={
								<span className='text-sm text-gray-700 dark:text-gray-400'>
									https://
								</span>
							}
							placeholder='www.example.com'
							variant='bordered'
							radius='sm'
						/>
						<Button
							startContent={<Plus className='w-4 h-4' />}
							variant='light'
							color='primary'
							className='p-0 data-[hover=true]:!bg-transparent mt-2'
							disableAnimation
						>
							Add another
						</Button>
					</div>
					<div>
						<label className='block mb-2 text-sm font-medium'>
							Profile picture
						</label>
						<ImageUpload />
					</div>
				</div>
			</div>
			<hr className='border-divider' />
			<section className='grid grid-cols-12 gap-x-16'>
				<div className='col-span-4'>
					<span className='block mb-1 text-xl font-semibold leading-normal'>
						Personal information
					</span>
					<Text variant='body' className='text-md'>
						This information is private and will not be displayed on your
						profile. It is used to fill out your applications quicker.
					</Text>
				</div>
				<div className='flex flex-col col-span-8 gap-8'>
					<div className='grid grid-cols-2 gap-x-4'>
						<Input
							name='firstName'
							label='First name'
							labelPlacement='outside'
							placeholder='First name'
							variant='bordered'
							radius='sm'
						/>
						<Input
							name='lastName'
							label='Last name'
							labelPlacement='outside'
							placeholder='Last name'
							variant='bordered'
							radius='sm'
						/>
					</div>
					<Input
						name='email'
						label='Email'
						type='email'
						labelPlacement='outside'
						placeholder='Email address'
						variant='bordered'
						radius='sm'
					/>
					<div className='grid grid-cols-2 gap-x-4'>
						<Input
							name='city'
							label='City'
							labelPlacement='outside'
							placeholder='City'
							variant='bordered'
							radius='sm'
						/>
						<Select
							name='state'
							label='State'
							labelPlacement='outside'
							placeholder='State'
							variant='bordered'
							radius='sm'
						>
							<SelectItem key='pennsylvania' value='pennsylvania'>
								Pennsylvania
							</SelectItem>
							<SelectItem key='new-jersey' value='new-jersey'>
								New Jersey
							</SelectItem>
						</Select>
					</div>
					<div className='grid grid-cols-2 gap-x-4'>
						<Select
							name='country'
							label='Country'
							labelPlacement='outside'
							placeholder='Country'
							variant='bordered'
							radius='sm'
						>
							<SelectItem key='united-states' value='united-states'>
								United States
							</SelectItem>
						</Select>
					</div>
					<Checkbox name='showEmail'>Show my email on my profile</Checkbox>
					<Checkbox name='showLocation'>
						Show my location on my profile
					</Checkbox>
				</div>
			</section>
			<hr className='border-divider' />
			<section className='grid grid-cols-12 gap-x-16'>
				<div className='col-span-4'>
					<span className='block mb-1 text-xl font-semibold leading-normal'>
						Private information
					</span>
					<Text variant='body' className='text-md'>
						This information is private and will not be displayed on your
						profile. It is used to fill out your applications quicker.
					</Text>
				</div>
				<div className='flex flex-col col-span-8 gap-8'>
					<div className='grid grid-cols-2 gap-x-4'>
						<Input
							name='phoneNumber'
							label='Phone number'
							labelPlacement='outside'
							placeholder='Phone number'
							variant='bordered'
							radius='sm'
						/>
						<Input
							name='birthday'
							label='Birthday'
							labelPlacement='outside'
							placeholder='Birthday'
							variant='bordered'
							radius='sm'
						/>
					</div>
					<div className='grid grid-cols-6 gap-x-4'>
						<Select
							name='gender'
							label='Gender'
							labelPlacement='outside'
							placeholder='Gender'
							variant='bordered'
							radius='sm'
						>
							<SelectItem key='male' value='male'>
								Male
							</SelectItem>
							<SelectItem key='female' value='female'>
								Female
							</SelectItem>
						</Select>
						<Select
							name='veteranStatus'
							label='Veteran status'
							labelPlacement='outside'
							placeholder='Veteran status'
							variant='bordered'
							radius='sm'
							className='col-span-3'
						>
							<SelectItem key='yes' value='yes'>
								I am a protected veteran
							</SelectItem>
							<SelectItem key='no' value='no'>
								I am not protected veteran
							</SelectItem>
						</Select>
						<Select
							name='ethnicity'
							label='Ethnicity'
							labelPlacement='outside'
							placeholder='Ethnicity'
							variant='bordered'
							radius='sm'
							className='col-span-2'
						>
							<SelectItem key='white' value='white'>
								Caucasian
							</SelectItem>
							<SelectItem key='black' value='black'>
								Black/African american
							</SelectItem>
						</Select>
					</div>
					<div className='grid grid-cols-3 gap-x-4'>
						<Select
							name='disabilityStatus'
							label='Disability status'
							labelPlacement='outside'
							placeholder='Disability status'
							variant='bordered'
							radius='sm'
						>
							<SelectItem key='yes' value='yes'>
								I am disabled
							</SelectItem>
							<SelectItem key='no' value='no'>
								I am not disabled
							</SelectItem>
						</Select>
						<Input
							name='disabilityDescription'
							label='Disability'
							labelPlacement='outside'
							placeholder='Please give a brief description'
							variant='bordered'
							radius='sm'
							className='col-span-2'
							disabled
						/>
					</div>
				</div>
			</section>

			<section className='flex justify-end'>
				<Button color='primary' radius='sm' type='submit'>
					Save changes
				</Button>
			</section>
		</form>
	);
}
