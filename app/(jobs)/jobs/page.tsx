import { title } from '@/components/primitives';

import JobCard from '@/app/(jobs)/jobs/JobCard';
import JobSearchBar from '@/app/(jobs)/jobs/JobSearchBar';
import { Pagination } from '@nextui-org/pagination';
import { Metadata } from 'next';
import Filters from './Filters';

export const metadata: Metadata = {
  title: 'Jobs',
  description: 'Find your next job',
};

export default function Jobs() {
  return (
    <>
      <h1 className={title()}>Jobs</h1>

      <div className='my-8'>
        <JobSearchBar />
      </div>

      <div className='flex flex-col md:flex-row gap-8 pt-8'>
        <Filters />
        <div>
          <div className='grid w-full gap-5 md:grid-cols-2 sm:grid-cols-1'>
            <JobCard
              position='Software Engineer, iOS'
              company='Apple, Inc.'
              companyLogo='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png'
              companyRating={4.5}
              postedDate='October 31, 2023'
              expirationDate='November 30, 2023'
              location='Cupertino, CA'
              pay='$150,000/yr'
              jobType='Full Time'
              companyOverview='Apple, Inc. is a world-renowned technology company known for
          pioneering innovation and iconic, user-centric products that have
          changed the way we live and connect.'
              requirements="Bachelor's or Master's Degree: A degree in Computer Science,
          Software Engineering, or a related field is typically required. iOS
          Development Expertise: Strong proficiency in iOS app development using
          Swift and Objective-C, along with a deep understanding of iOS."
              responsibilities="Design, develop, and maintain innovative and high-quality iOS
          applications for Apple's ecosystem."
            />
            <JobCard
              position='Azure Infrastructure Specialist, US Education'
              company='Microsoft Corporation'
              companyLogo='https://upload.wikimedia.org/wikipedia/commons/2/25/Microsoft_icon.svg'
              companyRating={5.0}
              postedDate='October 20, 2023'
              expirationDate='November 30, 2023'
              location='Redmond, WA'
              pay='$102,300/yr'
              jobType='Full Time'
              companyOverview="Microsoft's mission is to empower every person and every organization on the planet to achieve more. As employees we come together with a growth mindset, innovate to empower others, and collaborate to realize our shared goals. Each day we build on our values of respect, integrity, and accountability to create a culture of inclusion where everyone can thrive at work and beyond."
              requirements="Bachelor's Degree in Computer Science, Information Technology, Business Administration, or related field AND 4+ years technology-related sales or account management experience"
              responsibilities='You will lead a virtual team of sales, technical, and services resources to help customers realize the digital transformation through cloud computing'
            />
            <JobCard
              position='Program Management Office Lead, Mastery Go-to-Market'
              company='Google'
              companyLogo='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNDBsOjXiogo6sOzNFsAhNdEqXUy-93dC_SDpq&s=0'
              companyRating={4.5}
              postedDate='October 19, 2023'
              expirationDate='November 30, 2023'
              location='New York, NY'
              pay='$100,000-150,000/yr'
              jobType='Full Time'
              companyOverview="Google is a globally renowned technology company that specializes in internet-related services and products, with a mission to organize the world's information and make it universally accessible and useful. Join us in our commitment to innovation and shaping the future of the digital world."
              requirements="Bachelor's degree in a technical or quantitative/business-oriented field, or equivalent practical experience"
              responsibilities="The Business Operations team is responsible for driving day-to-day operations, creating and enhancing processes and governance, and building systems and tools that operationalize Mastery's business strategy"
            />
          </div>
          <div className='flex flex-row items-center justify-center my-52'>
            <Pagination total={5} initialPage={1} />
          </div>
        </div>
      </div>
    </>
  );
}
