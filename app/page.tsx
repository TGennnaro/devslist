import CountUp from '@/components/CountUp';
import GlowCircle from '@/components/GlowCircle';
import Text from '@/components/Text';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Image } from '@nextui-org/image';
import { Code2, LucideIcon, Search, Send } from 'lucide-react';
import NextImage from 'next/image';
import NextLink from 'next/link';

function Feature({
	Icon,
	title,
	description,
}: {
	Icon: LucideIcon;
	title: string;
	description: string;
}) {
	return (
		<div className='max-w-screen-md p-4 border border-gray-200 rounded-lg dark:border-gray-800 bg-gray-400/5 dark:bg-white/5'>
			<div className='flex items-center justify-center p-2 rounded-lg bg-primary w-fit'>
				<Icon className='w-6 h-6 text-white' />
			</div>
			<Text className='mt-4 font-bold text-gray-900 dark:text-gray-50'>
				{title}
			</Text>
			<Text className='mt-2'>{description}</Text>
		</div>
	);
}

function Testimonial({
	quote,
	name,
	title,
	image,
}: {
	quote: string;
	name: string;
	title: string;
	image: string;
}) {
	return (
		<div>
			<div className='flex gap-1'>
				<img src='/star.svg' alt='Star' />
				<img src='/star.svg' alt='Star' />
				<img src='/star.svg' alt='Star' />
				<img src='/star.svg' alt='Star' />
				<img src='/star.svg' alt='Star' />
			</div>
			<div className='mt-4'>
				<Text className='text-foreground'>&quot;{quote}&quot;</Text>
			</div>
			<div className='flex gap-2 mt-4'>
				<Image
					src={image}
					alt={name}
					width={48}
					height={48}
					className='w-12 h-12 rounded-full'
				/>
				<div className='flex flex-col justify-center'>
					<span className=''>{name}</span>
					<span className='text-sm text-gray-400'>{title}</span>
				</div>
			</div>
		</div>
	);
}

export default function Home() {
	return (
		<div className='mb-32'>
			<section className='grid grid-cols-1 mt-12 lg:grid-cols-2 lg:mt-36 gap-x-4'>
				<GlowCircle left={90} top={70} percent opacity={0.4} />
				<div className='relative max-w-screen-sm lg:max-w-full'>
					<GlowCircle left={0} top={30} percent />
					<Text variant='heading'>Discover new jobs for developers</Text>
					<Text variant='body' className='mt-4'>
						The all-in-one job platform for developers and employers. Applying
						for jobs has never been easier.
					</Text>
					<div className='flex gap-2 mt-8'>
						<Button color='primary' size='lg'>
							Find Jobs
						</Button>
						<Button variant='bordered' color='primary' size='lg'>
							Post Job
						</Button>
					</div>
				</div>
				<div className=''>
					<Image
						as={NextImage}
						src='interview.svg'
						alt='Interview'
						width={300}
						height={300}
						classNames={{
							wrapper: 'w-56 aspect-square mt-16 lg:mt-0 lg:ml-auto lg:w-auto',
						}}
					/>
				</div>
			</section>
			<section className='relative mt-56'>
				<GlowCircle
					top={50}
					left={25}
					percent
					color='secondary'
					opacity={0.5}
				/>
				<div className='max-w-screen-sm'>
					<Text variant='heading'>Stay a step ahead</Text>
					<Text variant='body' className='mt-4'>
						Find out what sets us apart from standard job search platforms. Stay
						ahead of the game with our modern approach to finding employment.
					</Text>
				</div>
				<div className='grid grid-cols-1 gap-4 mt-8 lg:grid-cols-3'>
					<Feature
						Icon={Code2}
						title='Developer-oriented'
						description='For developers, by developers. We only show you tech jobs so you can easily narrow down your job search. Uniquely showcase your projects and skills on your profile.'
					/>
					<Feature
						Icon={Search}
						title='Interactive job searching'
						description="Filter jobs that fit you, whether it's by skills, salary, location, or company ratings. Find jobs anywhere around the world or close to you with our unique interactive map."
					/>
					<Feature
						Icon={Send}
						title='Easy application process'
						description='Apply to jobs faster than ever before. Customize your profile, upload your resume, and apply! Keep tabs on all of your applications with ease.'
					/>
				</div>
			</section>
			<section className='relative mt-56'>
				<div className='max-w-screen-sm'>
					<Text variant='heading'>Don&apos;t just take it from us</Text>
					<Text variant='body' className='mt-4'>
						Hear what our users have to say about their experience with the
						platform.
					</Text>
				</div>
				<div className='grid grid-cols-1 mt-16 gap-x-4 gap-y-24 md:grid-cols-2'>
					<Testimonial
						quote='DevsList transformed my job search. As a software engineer, I was overwhelmed, but this platform simplified everything. The user-friendly interface and accurate job matching made finding internships and job listings a breeze. The interview and resume resources were invaluable. Thanks to DevsList, I secured my dream internship and launched my tech career.'
						name='John Doe'
						title='Software Engineer'
						image='https://i.pravatar.cc/150?u=a'
					/>
					<Testimonial
						quote="DevsList made my job search a breeze as a CS student looking for a summer internship. The personalized job recommendations were spot on, and the application process was seamless. The responsive support team felt like a true partner. Thanks to DevsList, I found a fantastic entry-level role within weeks. It's a must-visit for CS students and developers seeking meaningful opportunities."
						name='D.B. Cooper'
						title='CS Student'
						image='https://i.pravatar.cc/150?u=b'
					/>
				</div>
			</section>
			<section className='flex flex-col items-center justify-center gap-4 mt-56'>
				<div className='w-full px-6 py-8 mx-auto md:px-12 xl:px-6'>
					<div className='relative py-16'>
						<div
							aria-hidden='true'
							className='absolute inset-0 grid w-full grid-cols-2 m-auto opacity-50 h-max'
						>
							<div className='blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700'></div>
							<div className='blur-[106px] h-56 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600'></div>
						</div>
						<div className='relative'>
							<div className='flex items-center justify-center -space-x-2'>
								<Avatar
									className='shadow-md'
									src='https://i.pravatar.cc/150?u=1'
									size='sm'
								/>
								<Avatar
									className='shadow-md'
									src='https://i.pravatar.cc/150?u=2'
									size='md'
								/>
								<Avatar
									className='shadow-md'
									src='https://i.pravatar.cc/150?u=6'
									size='lg'
								/>
								<Avatar
									className='shadow-md'
									src='https://i.pravatar.cc/150?u=4'
									size='md'
								/>
								<Avatar
									className='shadow-md'
									src='https://i.pravatar.cc/150?u=5'
									size='sm'
								/>
							</div>
							<div className='m-auto mt-6 space-y-6 md:w-8/12 lg:w-7/12'>
								<h1 className='text-4xl font-bold text-center text-gray-800 dark:text-white md:text-5xl'>
									Let&apos;s find your career
								</h1>
								<p className='text-xl text-center text-gray-600 dark:text-gray-300'>
									Let us help you discover over{' '}
									<b>
										<CountUp end={10000} scrollSpyOnce />
									</b>{' '}
									jobs from{' '}
									<b>
										<CountUp end={100} scrollSpyOnce />
									</b>{' '}
									different companies{' '}
								</p>
								<div className='flex flex-wrap justify-center gap-6'>
									<NextLink href='/register'>
										<Button color='primary' variant='shadow' size='lg'>
											Get started
										</Button>
									</NextLink>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
	// return (
	//   <>
	//     <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
	//       <div className="justify-center inline-block text-center lg:w-2/3">
	//         <h1 className={title()}>Welcome to&nbsp;</h1>
	//         <h1 className={title({ color: "blue" })}>
	//           <TypeAnimation
	//             sequence={["DevsList", 1000]}
	//             wrapper="span"
	//             speed={25}
	//             repeat={Infinity}
	//           />
	//         </h1>
	//         <h2 className={subtitle({ class: "mt-4" })}>
	//           The all-in-one jobs platform for developers and employers.
	//         </h2>
	//       </div>
	//       <NextLink href="/register">
	//         <Button
	//           className={buttonStyles({
	//             color: "primary",
	//             radius: "sm",
	//             size: "lg",
	//             variant: "shadow",
	//           })}
	//         >
	//           Get started
	//         </Button>
	//       </NextLink>
	//     </section>

	//     <section className="flex flex-col items-center justify-center gap-4 py-20 md:py-20">
	//       <div className="justify-center inline-block text-center lg:w-2/3">
	//         <h1 className={title()}>Why&nbsp;</h1>
	//         <h1 className={title({ color: "blue" })}>DevsList</h1>
	//         <h1 className={title()}>?</h1>
	//       </div>
	//       <div className="flex flex-col gap-4 mt-8 md:flex-row">
	//         <div>
	//           <Card className="max-w-[400px] h-[100%] aspect-auto bg-gradient-to-r from-slate-600 to-slate-800 text-white">
	//             <CardHeader className="flex gap-3 font-semibold">
	//               <FaReact size={40} /> Developer-Oriented
	//             </CardHeader>
	//             <CardBody className="pt-2">
	//               <p>
	//                 For developers, by developers. We&apos;ll only show you tech
	//                 jobs so you can better narrow down your job search. Uniquely
	//                 showcase your projects and skills on your own profile.
	//               </p>
	//             </CardBody>
	//           </Card>
	//         </div>
	//         <div>
	//           <Card className="max-w-[400px] h-[100%] aspect-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white">
	//             <CardHeader className="flex gap-3 font-semibold">
	//               <FaMagnifyingGlass size={40} /> Interactive Job Searching
	//             </CardHeader>
	//             <CardBody className="pt-2">
	//               <p>
	//                 Filter jobs that fit you, whether it&apos;s by skills, salary,
	//                 location, or company ratings. Find jobs anywhere around the
	//                 world or close to you with our unique interactive map.
	//               </p>
	//             </CardBody>
	//           </Card>
	//         </div>
	//         <div>
	//           <Card className="max-w-[400px] h-[100%] aspect-auto bg-gradient-to-r from-violet-600 to-violet-800 text-white">
	//             <CardHeader className="flex gap-3 font-semibold">
	//               <BsSendFill size={40} /> Easy Application Process
	//             </CardHeader>
	//             <CardBody className="pt-2">
	//               <p>
	//                 Apply to jobs easier than ever before. Customize your profile,
	//                 upload your resume, and apply! Keep tabs on all of your
	//                 applications with ease.
	//               </p>
	//             </CardBody>
	//           </Card>
	//         </div>
	//       </div>
	//     </section>

	//     <section className="flex flex-col items-center justify-center gap-4 py-20 md:py-20">
	//       <h1 className={`${title()}`}>Hear from our users</h1>

	//       <div className="flex flex-col gap-4 mt-8 md:flex-row">
	//         <div>
	//           <Card className="max-w-[400px] aspect-auto">
	//             <CardHeader className="flex gap-3">
	//               <User
	//                 name="John Doe"
	//                 description="Software Engineer"
	//                 avatarProps={{
	//                   src: "https://i.pravatar.cc/150?u=a",
	//                 }}
	//               />
	//             </CardHeader>
	//             <CardBody className="pt-2">
	//               <p>
	//                 DevsList transformed my job search. As a software engineer, I
	//                 was overwhelmed, but this platform simplified everything. The
	//                 user-friendly interface and accurate job matching made finding
	//                 internships and job listings a breeze. The interview and
	//                 resume resources were invaluable. Thanks to DevsList, I
	//                 secured my dream internship and launched my tech career.
	//               </p>
	//             </CardBody>
	//           </Card>
	//         </div>
	//         <div>
	//           <div>
	//             <Card className="max-w-[400px] aspect-auto">
	//               <CardHeader className="flex gap-3">
	//                 <User
	//                   name="D.B. Cooper"
	//                   description="CS Student"
	//                   avatarProps={{
	//                     src: "https://i.pravatar.cc/150?u=b",
	//                   }}
	//                 />
	//               </CardHeader>
	//               <CardBody className="pt-2">
	//                 <p>
	//                   DevsList made my job search a breeze as a CS student looking
	//                   for a summer internship. The personalized job
	//                   recommendations were spot on, and the application process
	//                   was seamless. The responsive support team felt like a true
	//                   partner. Thanks to DevsList, I found a fantastic entry-level
	//                   role within weeks. It&apos;s a must-visit for CS students
	//                   and developers seeking meaningful opportunities.
	//                 </p>
	//               </CardBody>
	//             </Card>
	//           </div>
	//         </div>
	//         <div>
	//           <div>
	//             <Card className="max-w-[400px] aspect-auto">
	//               <CardHeader className="flex gap-3">
	//                 <User
	//                   name="Jane Doe"
	//                   description="iOS App Developer"
	//                   avatarProps={{
	//                     src: "https://i.pravatar.cc/150?u=c",
	//                   }}
	//                 />
	//               </CardHeader>
	//               <CardBody className="pt-2">
	//                 <p>
	//                   DevsList is a game-changer for developers. It stands out
	//                   with its quality job listings and tailored features. The
	//                   developer profiles and portfolio tools allowed me to
	//                   showcase my skills effectively. The weekly newsletter kept
	//                   me updated on industry trends and job opportunities. Thanks
	//                   to DevsList, I found a role that aligns perfectly with my
	//                   skills and ambitions.
	//                 </p>
	//               </CardBody>
	//             </Card>
	//           </div>
	//         </div>
	//       </div>
	//     </section>

	//     <section className="flex flex-col items-center justify-center gap-4 py-20 md:py-20">
	//       <div className="w-full px-6 py-8 mx-auto md:px-12 xl:px-6">
	//         <div className="relative py-16">
	//           <div
	//             aria-hidden="true"
	//             className="absolute inset-0 grid w-full grid-cols-2 m-auto opacity-50 h-max"
	//           >
	//             <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
	//             <div className="blur-[106px] h-56 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
	//           </div>
	//           <div className="relative">
	//             <div className="flex items-center justify-center -space-x-2">
	//               <Avatar
	//                 className="shadow-md"
	//                 src="https://i.pravatar.cc/150?u=1"
	//                 size="sm"
	//               />
	//               <Avatar
	//                 className="shadow-md"
	//                 src="https://i.pravatar.cc/150?u=2"
	//                 size="md"
	//               />
	//               <Avatar
	//                 className="shadow-md"
	//                 src="https://i.pravatar.cc/150?u=3"
	//                 size="lg"
	//               />
	//               <Avatar
	//                 className="shadow-md"
	//                 src="https://i.pravatar.cc/150?u=4"
	//                 size="md"
	//               />
	//               <Avatar
	//                 className="shadow-md"
	//                 src="https://i.pravatar.cc/150?u=5"
	//                 size="sm"
	//               />
	//             </div>
	//             <div className="m-auto mt-6 space-y-6 md:w-8/12 lg:w-7/12">
	//               <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white md:text-5xl">
	//                 Let&apos;s find your career
	//               </h1>
	//               <p className="text-xl text-center text-gray-600 dark:text-gray-300">
	//                 Let us help you discover over{" "}
	//                 <b>
	//                   <CountUp end={10000} scrollSpyOnce />
	//                 </b>{" "}
	//                 jobs from{" "}
	//                 <b>
	//                   <CountUp end={100} scrollSpyOnce />
	//                 </b>{" "}
	//                 different companies{" "}
	//               </p>
	//               <div className="flex flex-wrap justify-center gap-6">
	//                 <NextLink href="/register">
	//                   <Button
	//                     className={buttonStyles({
	//                       color: "primary",
	//                       radius: "sm",
	//                       size: "lg",
	//                       variant: "shadow",
	//                     })}
	//                   >
	//                     Get started
	//                   </Button>
	//                 </NextLink>
	//               </div>
	//             </div>
	//           </div>
	//         </div>
	//       </div>
	//     </section>
	//   </>
	// );
}
