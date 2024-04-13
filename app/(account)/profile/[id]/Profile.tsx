import { Experience, Education, User, GitHubProject } from '@/db/schema';
import Socials from './Socials';
import AboutMe from './AboutMe';
import ProjectsShowcase from './ProjectsShowcase';
import SkillsShowcase from './SkillsShowcase';
import EducationHistory from './EducationHistory';
import WorkHistory from './WorkHistory';
import UserCard from './UserCard';

export default function Profile({
	session,
	user,
	projectsShowcase,
	workHistory,
	educationHistory,
}: {
	session: Omit<User, 'password'> | null;
	user: Omit<User, 'password'>;
	projectsShowcase: GitHubProject[];
	workHistory: Experience[];
	educationHistory: Education[];
}) {
	return (
		<>
			<div className='flex flex-col md:flex-row gap-3'>
				<div className='flex flex-col gap-3 w-full basis-1/4'>
					<UserCard session={session} user={user} />
					<Socials />
				</div>
				<div className='flex flex-col gap-3 basis-3/4'>
					{user.about && <AboutMe bio={user.about} />}
					{projectsShowcase.length > 0 && (
						<ProjectsShowcase projects={projectsShowcase} />
					)}
					{user.skills.length > 0 && <SkillsShowcase skills={user.skills} />}
					{educationHistory.length > 0 && (
						<EducationHistory history={educationHistory} />
					)}
					{workHistory.length > 0 && <WorkHistory history={workHistory} />}
				</div>
			</div>
		</>
	);
}
