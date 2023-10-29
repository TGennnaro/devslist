import { db } from '@/db';
import { Jobs } from '@/db/schema';
import { Users } from '@/db/schema';
import { Company } from '@/db/schema';

export async function GET() {
  const data = await db.select().from(Jobs);

  return Response.json({ data });
}
