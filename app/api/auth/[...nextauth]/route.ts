import NextAuth from 'next-auth/next';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import bcrypt from 'bcrypt';
import { User, Users } from '@/db/schema';
import { db } from '@/db';
import { eq } from 'drizzle-orm';
import type { User as AuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { decrypt, encrypt, getUser } from '@/lib/server_utils';

const authOptions: AuthOptions = {
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
								accessToken: users[0].githubAccessToken
									? decrypt(users[0].githubAccessToken)
									: undefined,
							} as AuthUser & JWT;
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
			if (account) {
				const session = await getUser();

				// Did user click GitHub OAuth button?
				if (account?.provider === 'github') {
					// User is currently authenticated but would like to link their GitHub account
					if (session?.id) {
						// Attach GitHub account ID to current user
						const dbUser = await db
							.update(Users)
							.set({
								githubID: account.providerAccountId,
								githubAccessToken: account.access_token
									? encrypt(account.access_token)
									: '',
							})
							.where(eq(Users.id, session.id));

						// Issue new token
						return {
							id: session.id,
							email: session.email,
							firstName: session.firstName,
							lastName: session.lastName,
							accessToken: account.access_token,
						};
					} else {
						// User is just signing in with GitHub

						// Find user with same GitHub account ID
						const dbUser = await db
							.select()
							.from(Users)
							.where(eq(Users.githubID, account.providerAccountId));

						// User has not signed in with GitHub before
						if (dbUser.length === 0) {
							const insertedUser = await db.insert(Users).values({
								email: user.email!,
								picture_url: user.image,
								githubID: account.providerAccountId,
								githubAccessToken: account.access_token
									? encrypt(account.access_token)
									: null,
							});

							const insertedUserDetails = await db
								.select()
								.from(Users)
								.where(eq(Users.id, Number(insertedUser.insertId)));

							return {
								id: Number(insertedUser.insertId),
								email: insertedUserDetails[0].email,
								firstName: insertedUserDetails[0].firstName,
								lastName: insertedUserDetails[0].lastName,
								accessToken: account.access_token,
							};
						} else {
							// User has GitHub account - issue token
							return {
								id: dbUser[0].id,
								email: dbUser[0].email,
								firstName: dbUser[0].firstName,
								lastName: dbUser[0].lastName,
								accessToken: account.access_token,
							};
						}
					}
				} else {
					// User signed in with credentials

					const dbUser = await db
						.select()
						.from(Users)
						.where(eq(Users.id, Number(user.id)));

					if (dbUser.length === 0) {
						token.id = parseInt(user!.id.toString());
						return token;
					}

					return {
						id: dbUser[0].id,
						email: dbUser[0].email,
						firstName: dbUser[0].firstName,
						lastName: dbUser[0].lastName,
						accessToken: user.accessToken,
					};
				}
			}

			return token;
		},
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
