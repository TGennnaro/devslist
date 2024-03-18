import { Card } from '@/components/ui/card';
import { CardHeader, CardBody, CardFooter } from '@nextui-org/card';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Button } from '@nextui-org/button';
import { ExternalLink, Minus, Plus } from 'lucide-react';
import { Github } from 'lucide-react';
import { Zap } from 'lucide-react';
import NextLink from 'next/link';
import { Image } from '@nextui-org/image';
import { Tooltip } from '@nextui-org/tooltip';
import { GitHubRepo } from '@/types';
import React from 'react';
import { GitHubProject } from '@/db/schema';

export default function MyProjects({
	displayedGitHubProjects,
	availableGitHubProjects,
	selectedProjects,
	setSelectedProjects,
}: {
	displayedGitHubProjects: GitHubRepo[];
	availableGitHubProjects: GitHubRepo[];
	selectedProjects: GitHubRepo[];
	setSelectedProjects: React.Dispatch<React.SetStateAction<GitHubRepo[]>>;
}) {
	return (
		<>
			<div className='flex flex-col gap-3 flex-wrap mt-8'>
				{selectedProjects.length > 0 ? (
					<label className='block mb-2 text-sm font-medium'>
						Project showcase
					</label>
				) : null}
				<div className='flex flex-row gap-3 items-center flex-wrap mb-5'>
					{selectedProjects.map((project: GitHubRepo) => (
						<Card
							className='hover:bg-slate-100 dark:hover:bg-slate-800'
							key={project.id}
						>
							<CardHeader className='flex gap-3 items-center'>
								<div className='flex flex-row gap-3'>
									{project.owner?.avatar_url ? (
										<Image
											alt='GitHub avatar'
											height={35}
											radius='sm'
											src={project.owner.avatar_url}
											width={35}
										/>
									) : null}
									<p className='text-md font-semibold pb-3'>{project.name}</p>
									{project.language ? (
										<Chip color='default' variant='faded'>
											{project.language}
										</Chip>
									) : null}
								</div>
								<Tooltip color='default' content='Remove from DevsList profile'>
									<Button
										variant='flat'
										color='danger'
										size='sm'
										onClick={() => {
											setSelectedProjects(
												selectedProjects.filter(
													(selectedProject) => selectedProject !== project
												)
											);
										}}
									>
										<Minus />
									</Button>
								</Tooltip>
							</CardHeader>
							<>
								<Divider />
								<CardBody>
									<p>{project.description ?? 'No description'}</p>
								</CardBody>
							</>
							<Divider />
							<CardFooter>
								<div className='flex flex-row flex-wrap gap-1'>
									{project.html_url ? (
										<NextLink href={project.html_url} target='_BLANK'>
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
									) : null}
									{project.homepage ? (
										<NextLink href={project.homepage} target='_BLANK'>
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
									) : null}
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
				<label className='block mb-2 text-sm font-medium'>
					Your public GitHub projects:
				</label>
				<div className='flex flex-row gap-3 items-center flex-wrap'>
					{availableGitHubProjects.map((project: GitHubRepo) => (
						<Card
							className='hover:bg-slate-100 dark:hover:bg-slate-800'
							key={project.id}
						>
							<CardHeader className='flex gap-3 items-center'>
								{project.owner?.avatar_url ? (
									<Image
										alt='GitHub avatar'
										height={35}
										radius='sm'
										src={project.owner.avatar_url}
										width={35}
									/>
								) : null}
								<div className='flex flex-row gap-3'>
									<p className='text-md font-semibold pb-3'>{project.name}</p>
									{project.language ? (
										<div className='flex flex-row flex-wrap gap-1'>
											<Chip color='default' variant='faded'>
												{project.language}
											</Chip>
										</div>
									) : null}
								</div>
								<Tooltip color='default' content='Display on DevsList profile'>
									<Button
										variant='flat'
										color='primary'
										size='sm'
										onClick={() => {
											if (!selectedProjects.includes(project)) {
												setSelectedProjects([...selectedProjects, project]);
											}
										}}
										isDisabled={selectedProjects.some(
											(otherProject) => otherProject.id === project.id
										)}
									>
										<Plus />
									</Button>
								</Tooltip>
							</CardHeader>
							<>
								<Divider />
								<CardBody>
									<p>{project.description ?? 'No description'}</p>
								</CardBody>
							</>
							<Divider />
							<CardFooter>
								<div className='flex flex-row flex-wrap gap-1'>
									{project.html_url ? (
										<NextLink href={project.html_url} target='_BLANK'>
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
									) : null}
									{project.homepage ? (
										<NextLink href={project.homepage} target='_BLANK'>
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
									) : null}
								</div>
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</>
	);
}
