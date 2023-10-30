import { Button } from '@nextui-org/button';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import NextLink from 'next/link';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
import { FaMapPin } from 'react-icons/fa';
import { FcClock, FcMoneyTransfer, FcWorkflow } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

const generateRatingStars = (companyRating: number) => {
  const stars = [];
  let starsLeft = companyRating;

  for (let i = 0; i < 5; i++) {
    if (starsLeft >= 1.0) {
      // First generate filled stars
      stars.push(<BsStarFill key={i} color='gold' />);
      starsLeft -= 1.0;
    } else if (starsLeft >= 0.5) {
      // Then half stars
      stars.push(<BsStarHalf key={i} color='gold' />);
      starsLeft -= 0.5;
    } else {
      // Then empty stars
      stars.push(<BsStar key={i} color='gold' />);
    }
  }

  return stars;
};

export default function JobCard({
  id,
  position,
  company,
  companyLogo,
  companyRating,
  postedDate,
  expirationDate,
  location,
  pay,
  jobType,
}: {
  id: number;
  position: string;
  company: string;
  companyLogo: string;
  companyRating: number;
  postedDate: string;
  expirationDate: string;
  location: string;
  pay?: string;
  jobType: string;
}) {
  const router = useRouter();
  return (
    <Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
      <CardHeader className='flex gap-3'>
        <Image
          isBlurred
          alt='Company logo'
          height={40}
          radius='sm'
          src={companyLogo}
          width={40}
          className='object-contain p-1 dark:bg-gray-500 aspect-square'
        />
        <div className='flex flex-col'>
          <p className='text-md'>{position}</p>
          <p className='flex items-center gap-1 text-small text-default-500'>
            <NextLink href='#' className='underline'>
              {company}
            </NextLink>{' '}
            | {companyRating.toFixed(1)} {generateRatingStars(companyRating)}
          </p>
          <p className='flex items-center gap-1 text-small text-default-500'>
            <FcClock /> Available until {expirationDate}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className='flex gap-1'>
          <span className='font-semibold'>Posted:</span>
          {postedDate}
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>Location:</span>
          <FaMapPin className='text-red-500' /> {location}
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>Pay:</span>
          <FcMoneyTransfer /> {pay}
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-semibold'>Type:</span>
          <FcWorkflow /> {jobType}
        </div>
        {/* <div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcOrganization /> Company Overview
				</div>
				<p>{companyOverview}</p>
				<div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcCheckmark /> Requirements
				</div>
				<p>{requirements}</p>
				<div className='flex items-center gap-1 pt-3 font-semibold'>
					<FcList /> Responsibilities
				</div>
				<p>{responsibilities}</p> */}
      </CardBody>
      <CardFooter className='gap-3'>
        <Button
          variant='flat'
          size='md'
          onClick={() => router.push(`/jobs/${id}`)}
        >
          View Job
        </Button>
      </CardFooter>
    </Card>
  );
}
