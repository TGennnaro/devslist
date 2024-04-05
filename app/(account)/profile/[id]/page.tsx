import { db } from '@/db';
import { Users, GitHubProjects, Experience, Education } from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
import Profile from './Profile';
import { getUser, getUserById } from '@/lib/server_utils';

export default async function Page({ params }: { params: { id: number } }) {
	const session = await getUser();

	const userExists = await db
		.select()
		.from(Users)
		.where(eq(Users.id, params.id))
		.then((res) => res.length > 0);

	if (userExists) {
		async function getProjectsShowcase() {
			const showcase = await db
				.select()
				.from(GitHubProjects)
				.where(eq(GitHubProjects.userId, params.id));
			return showcase;
		}

		async function getWorkHistory() {
			const history = await db
				.select()
				.from(Experience)
				.where(eq(Experience.userId, params.id))
				.orderBy(asc(Experience.startMonth), desc(Experience.startYear));
			return history;
		}

		async function getEducationHistory() {
			const history = await db
				.select()
				.from(Education)
				.where(eq(Education.userId, params.id))
				.orderBy(asc(Education.startMonth), desc(Education.startYear));
			return history;
		}

		const [userData, projectsShowcase, workHistory, educationHistory] =
			await Promise.all([
				getUserById(params.id),
				getProjectsShowcase(),
				getWorkHistory(),
				getEducationHistory(),
			]);

		return (
			<Profile
				session={session}
				user={userData!}
				projectsShowcase={projectsShowcase}
				workHistory={workHistory}
				educationHistory={educationHistory}
			/>
		);
	}

	return (
		<div className='flex items-center justify-center'>User does not exist.</div>
	);
}
