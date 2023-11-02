import { authOptions } from './auth';
import { db } from '@/db';
import { Users, User } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';

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
