import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import { User, Users } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import type { User as AuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
	session: {
		strategy: 'jwt',
	},
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
					if (users.length > 0 && users[0].password) {
						const res = await bcrypt.compare(password, users[0].password);
						if (res === true) {
							return {
								id: users[0].id,
								email: users[0].email,
								firstName: users[0].firstName,
								lastName: users[0].lastName,
							} as AuthUser;
						}
					}
					return null;
				} catch (err) {
					console.error('Auth error: ', err);
					return null;
				}
			},
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async session({ token, session }) {
			if (token && session?.user) {
				const profilePhoto = await db
					.select({ image: Users.picture_url })
					.from(Users)
					.where(eq(Users.id, token.id));

				session.user.id = token.id;
				session.user.email = token.email;
				session.user.firstName = token.firstName;
				session.user.lastName = token.lastName;
				session.accessToken = token.accessToken;

				if (profilePhoto) {
					const { image } = profilePhoto[0];
					session.user.image = image;
				}
			}

			return session;
		},
		async jwt({ account, token, user }) {
			if (account?.provider === 'github') {
				const dbUser = await db
					.select()
					.from(Users)
					.where(eq(Users.githubID, account.providerAccountId));

				if (dbUser.length === 0) {
					const insertedUser = await db
						.insert(Users)
						.values({
							email: user.email!,
							picture_url: user.image,
							githubID: account.providerAccountId,
						})
						.returning({
							insertedId: Users.id,
							insertedEmail: Users.email,
							insertedFirstName: Users.firstName,
							insertedLastName: Users.lastName,
						});

					return {
						id: insertedUser[0].insertedId,
						email: insertedUser[0].insertedEmail,
						firstName: insertedUser[0].insertedFirstName,
						lastName: insertedUser[0].insertedLastName,
						accessToken: account.access_token,
					};
				} else {
					return {
						id: dbUser[0].id,
						email: dbUser[0].email,
						firstName: dbUser[0].firstName,
						lastName: dbUser[0].lastName,
						accessToken: account.access_token,
					};
				}
			}

			const dbUser = await db
				.select()
				.from(Users)
				.where(eq(Users.id, token.id));

			if (dbUser.length === 0) {
				token.id = parseInt(user!.id.toString());
				return token;
			}

			return {
				id: dbUser[0].id,
				email: dbUser[0].email,
				firstName: dbUser[0].firstName,
				lastName: dbUser[0].lastName,
			};
		},
	},
};
