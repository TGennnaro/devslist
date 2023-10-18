import type { Profile, Session, User } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: User & {
			id: number;
			email: string;
			firstName: string;
			lastName: string;
		};
	}
}
