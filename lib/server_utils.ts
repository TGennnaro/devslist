import { authOptions } from './auth';
import { db } from '@/db';
import {
	Users,
	User,
	Jobs,
	Company,
	GitHubProjects,
	GitHubProject,
} from '@/db/schema';
import { GitHubRepo } from '@/types';
import { eq, isNotNull, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { Octokit } from 'octokit';
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

export const dynamic = 'force-dynamic';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export async function getUser() {
	const session = await getServerSession(authOptions);
	if (!session?.user.id) {
		return null;
	}
	// make the password field optional so it can be deleted.
	const user: PartialBy<User, 'password'> = (
		await db.select().from(Users).where(eq(Users.id, session?.user.id))
	)?.[0];
	delete user.password;
	return user as Omit<User, 'password'>;
}

export async function getAvailableGitHubProjects() {
	const session = await getServerSession(authOptions);
	if (!session?.user.id || !session?.accessToken) {
		return null;
	} else {
		const octokit = new Octokit({
			auth: session.accessToken,
		});

		const repos = await octokit.request('GET /user/repos', {
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});

		const data: GitHubRepo[] = repos.data;

		return data;
	}
}

export async function getDisplayedGitHubProjects() {
	const session = await getServerSession(authOptions);
	if (!session?.user.id || !session?.accessToken) {
		return null;
	} else {
		const projects = await db
			.select()
			.from(GitHubProjects)
			.where(eq(GitHubProjects.userId, session?.user.id));

		const data: GitHubRepo[] = projects.map((project: GitHubProject) => ({
			id: project.repoId,
			name: project.projectName,
			html_url: project.githubUrl,
			description: project.projectDescription,
			homepage: project.homepageUrl,
			language: project.language,
		}));

		return data;
	}
}

export async function getMapEligibleJobs() {
	const jobs = await db
		.select()
		.from(Jobs)
		.where(isNotNull(Jobs.address))
		.leftJoin(Company, eq(Jobs.companyId, Company.id));

	return jobs;
}

export function encrypt(plaintext: string) {
	const ciphertext = AES.encrypt(
		plaintext,
		process.env.DEVSLIST_SECRET_KEY!
	).toString();

	return ciphertext;
}

export function decrypt(ciphertext: string) {
	const plaintext = AES.decrypt(
		ciphertext,
		process.env.DEVSLIST_SECRET_KEY!
	).toString(CryptoJS.enc.Utf8);

	return plaintext;
}
