import Image from 'next/image';

export default function MapLegend() {
	return (
		<div className='flex flex-col gap-2'>
			<span className='font-bold'>Legend</span>
			<div className='flex items-center gap-2'>
				<Image
					alt='Full-Time Icon'
					src='/full_time_job_map_marker.png'
					height='30'
					width='25'
				/>
				<span>Full-Time</span>
			</div>
			<div className='flex items-center gap-2'>
				<Image
					alt='Part-Time Icon'
					src='/part_time_job_map_marker.png'
					height='30'
					width='25'
				/>
				<span>Part-Time</span>
			</div>
			<div className='flex items-center gap-2'>
				<Image
					alt='Internship Icon'
					src='/internship_map_marker.png'
					height='30'
					width='25'
				/>
				<span>Internship</span>
			</div>
			<div className='flex items-center gap-2'>
				<Image
					alt='Freelance Icon'
					src='/freelance_map_marker.png'
					height='30'
					width='25'
				/>
				<span>Freelance</span>
			</div>
			<div className='flex items-center gap-2'>
				<Image
					alt='Other Icon'
					src='/default_map_marker.png'
					height='30'
					width='25'
				/>
				<span>Other</span>
			</div>
		</div>
	);
}
