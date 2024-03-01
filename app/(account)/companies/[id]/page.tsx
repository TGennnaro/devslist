import { title } from '@/components/primitives';
import { db } from '@/db';
import { Company } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Metadata } from 'next';
import ApplicationsTable from './ApplicationsTable';
import { getUser } from '@/lib/server_utils';

export async function generateMetadata({ params }: { params: { id: string } }) {
	if (isNaN(parseInt(params.id))) return { title: 'Unknown' };
	const result = await db
		.select()
		.from(Company)
		.where(eq(Company.id, parseInt(params.id)));
	if (result.length === 0) return { title: 'Unknown' };
	return {
		title: result[0].name,
	} satisfies Metadata;
}

export default async function Page({ params }: { params: { id: number } }) {
	const [companyInfo] = await db
		.select()
		.from(Company)
		.where(eq(Company.id, params.id));
	if (!companyInfo) return <h1>Company not found</h1>;
	if (companyInfo.userId !== (await getUser())?.id)
		return <h1>Unauthorized</h1>;
	return (
		<section>
			<h1 className={title()}>{companyInfo.name}</h1>
			<ApplicationsTable id={companyInfo.id} />
		</section>
	);
}
