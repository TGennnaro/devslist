import { CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Card } from '@/components/ui/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import { ExternalLink, Github, Zap } from 'lucide-react';
import { Button } from '@nextui-org/button';
import { GitHubProject } from '@/db/schema';
import NextLink from 'next/link';

export default function ProjectsShowcase({
	projects,
}: {
	projects: GitHubProject[];
}) {
	return (
		<Card>
			<CardHeader className='text-3xl font-medium'>My Projects</CardHeader>
			<CardBody className='grid w-full gap-3 md:grid-cols-2 sm:grid-cols-1'>
				{projects.map((project) => {
					return (
						<Card
							key={project.id}
							className='hover:bg-slate-100 dark:hover:bg-slate-800'
						>
							<CardHeader className='flex gap-3 items-center bg-gray-200/30 dark:bg-gray-600/30'>
								<span className='font-medium'>{project.projectName}</span>
								{project.language && (
									<Chip color='default' variant='faded'>
										{project.language}
									</Chip>
								)}
							</CardHeader>
							<Divider />
							<CardBody>
								{project.projectDescription ?? 'No description'}
							</CardBody>
							<Divider />
							<CardFooter className='flex gap-1 bg-gray-200/30 dark:bg-gray-600/30'>
								{project.githubUrl && (
									<NextLink href={project.githubUrl} target='_BLANK'>
										<Button
											color='default'
											variant='ghost'
											startContent={<Github />}
											endContent={<ExternalLink size={15} />}
											size='sm'
										>
											View repository
										</Button>
									</NextLink>
								)}
								{project.homepageUrl && (
									<NextLink href={project.homepageUrl} target='_BLANK'>
										<Button
											color='secondary'
											variant='ghost'
											startContent={<Zap />}
											endContent={<ExternalLink size={15} />}
											size='sm'
										>
											View live demo
										</Button>
									</NextLink>
								)}
							</CardFooter>
						</Card>
					);
				})}
			</CardBody>
		</Card>
	);
}
