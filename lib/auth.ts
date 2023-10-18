import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { User, Users } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Email and Password',
			credentials: {
				username: { label: 'Email', type: 'text', placeholder: 'Email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				try {
					const { username, password } = credentials as {
						username: string;
						password: string;
					};
					const users: User[] = await db
						.select()
						.from(Users)
						.where(eq(Users.email, username))
						.limit(1);
					if (users.length > 0) {
						const res = await bcrypt.compare(password, users[0].password);
						if (res === true) {
							return {
								id: users[0].userid.toString(),
								email: users[0].email,
								firstName: users[0].firstName,
								lastName: users[0].lastName,
							};
						}
					}
					return null;
				} catch (err) {
					console.error('Auth error: ', err);
					return null;
				}
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
};
