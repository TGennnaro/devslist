import { NextResponse } from 'next/server';
import { JobPosting } from '@/types';
import { z } from 'zod';

const schema = z.object({
  jobTitle: z.string().max(100, 'Job title cannot exceed 100 characters.'),

  jobType: z.string(),

  jobResponsibilities: z.string(),

  jobDescription: z.string(),

  workAddress: z.string(),

  skills: z.string(),

  expirationDate: z.string(),

  showPayRate: z.string().optional(),

  payType: z.string().optional(),

  salary: z.string().optional(),

  hourlyRate: z.string().optional(),
});

export async function POST(req: Request, res: Response) {
  const formData = await req.formData();
  const data: JobPosting = {
    jobTitle: formData.get('jobTitle') as string,
    jobType: formData.get('jobType') as string,
    jobResponsibilities: formData.get('jobResponsibilities') as string,
    jobDescription: formData.get('jobDescription') as string,
    workAddress: formData.get('workAddress') as string,
    skills: formData.get('skills') as string,
    expirationDate: formData.get('expirationDate') as any,
    showPayRate: (formData.get('showPayRate') as any) ?? undefined,
    payType: (formData.get('payType') as string) ?? undefined,
    salary: (formData.get('salary') as any) ?? undefined,
    hourlyRate: (formData.get('hourlyRate') as any) ?? undefined,
  };

  // for (const [k, v] of Object.entries(data)) {
  //   if (v === '') {
  //     data[k] = undefined;
  //   }
  // }

  try {
    const {
      jobTitle,
      jobType,
      jobResponsibilities,
      jobDescription,
      workAddress,
      skills,
      expirationDate,
      showPayRate,
      payType,
      salary,
      hourlyRate,
    } = schema.parse(data);
    console.log('Data passed');
    console.log(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log(e.issues);
      return NextResponse.json({ message: e.issues[0] }, { status: 400 });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: 'OK' }, { status: 200 });
}
