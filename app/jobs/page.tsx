import { title } from '@/components/primitives';
import { FaSearch } from 'react-icons/fa';
import { Input } from '@nextui-org/input';
import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
} from '@nextui-org/dropdown';
import { Button } from '@nextui-org/button';
import { Pagination } from '@nextui-org/pagination';
import { JobCard } from '@/components/JobCard';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Jobs',
	description: 'Find your next job',
};

export default function Jobs() {
	return (
		<>
			<h1 className={title()}>Jobs</h1>

			<div className='my-8'>
				<Input
					type='email'
					label='Search'
					placeholder='Job title, location, company, requirements, ...'
					startContent={<FaSearch />}
				/>
			</div>

			<div className='flex flex-row items-center justify-center gap-3'>
				<div>
					<Dropdown>
						<DropdownTrigger>
							<Button variant='shadow'>Role</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label='Static Actions'>
							<DropdownItem>Any Role</DropdownItem>
							<DropdownItem>Full Time</DropdownItem>
							<DropdownItem>Part Time</DropdownItem>
							<DropdownItem>Internship</DropdownItem>
							<DropdownItem>Freelance</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
				<div>
					<Dropdown>
						<DropdownTrigger>
							<Button variant='shadow'>Salary</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label='Static Actions'>
							<DropdownItem>todo</DropdownItem>
							<DropdownItem>todo</DropdownItem>
							<DropdownItem>todo</DropdownItem>
							<DropdownItem>todo</DropdownItem>
							<DropdownItem>todo</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>

			<div className='grid gap-5 my-8 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1'>
				<JobCard />
				<JobCard />
				<JobCard />
				<JobCard />
			</div>

			<div className='flex flex-row items-center justify-center my-52'>
				<Pagination total={5} initialPage={1} />
			</div>
		</>
	);
}
