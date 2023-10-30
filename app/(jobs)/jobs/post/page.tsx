import { title } from '@/components/primitives';
import JobPostingForm from './JobPostingForm';

export default function PostJob() {
  return (
    <>
      <h1 className={title()}>Post a Job</h1>
      <JobPostingForm />
    </>
  );
}
