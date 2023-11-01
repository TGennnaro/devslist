import type { Profile, Session, User } from 'next-auth';

declare module 'next-auth/jwt' {
	interface JWT extends User {
		id: number;
	}
}

declare module 'next-auth' {
	interface User {
		id: number;
		email: string | null | undefined;
		firstName: string | null | undefined;
		lastName: string | null | undefined;
	}

	interface Session {
		user: User;
	}
}
