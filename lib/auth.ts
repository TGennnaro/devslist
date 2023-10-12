import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

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
					const user = { id: '1', email: 'jdoe@example.com', password: '123' };
					if (user !== null) {
						const res = await bcrypt.compare(password, user.password);
						if (res === true) {
							return user;
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
};
