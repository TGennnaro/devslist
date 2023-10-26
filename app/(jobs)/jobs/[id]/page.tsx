import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import {
  Briefcase,
  CalendarClock,
  CircleDollarSign,
  MapPin,
  Send,
} from 'lucide-react';
import { Button } from '@nextui-org/button';
import Text from '@/components/Text';
import { Image } from '@nextui-org/image';
import { Metadata } from 'next';
import { User } from '@nextui-org/user';

const metadata: Metadata = {
  title: 'Job Posting',
  description: 'Find your next job',
};

export default function Page({ params }: { params: { id: number } }) {
  return (
    <>
      <div className='flex flex-row gap-5 mb-8 items-center'>
        <div>
          <Image
            isBlurred
            alt='Company logo'
            height={40}
            radius='sm'
            src='https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png'
            width={40}
            className=' p-0.5 dark:bg-gray-500'
          />
        </div>
        <div>
          <div className='text-3xl font-bold'>Job Posting {params.id}</div>
          <div className='text-medium font-semibold'>Apple, Inc.</div>
        </div>
        <div>
          <Button endContent={<Send />} variant='solid' color='primary'>
            Apply Now
          </Button>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-5'>
        <div className='basis-1/3'>
          <div className='flex flex-col gap-3'>
            <div>
              <div className='text-2xl font-semibold'>Availability</div>
              <Text variant='body'>
                <div className='flex items-center gap-1'>
                  <CalendarClock /> November 1, 2023 - November 30, 2023
                </div>
              </Text>
            </div>
            <Divider />
            <div>
              <div className='text-2xl font-semibold'>Location</div>
              <Text variant='body'>
                <div className='flex items-center gap-1'>
                  <MapPin /> Cupertino, CA
                </div>
              </Text>
            </div>
            <Divider />
            <div>
              <div className='text-2xl font-semibold'>Pay</div>
              <Text variant='body'>
                <div className='flex items-center gap-1'>
                  <CircleDollarSign /> $120,000/yr
                </div>
              </Text>
            </div>
            <Divider />
            <div className='text-2xl font-semibold'>Job Type</div>
            <div>
              <Chip startContent={<Briefcase />} color='primary'>
                Full Time
              </Chip>
              <Chip startContent={<Briefcase />} color='secondary'>
                Part Time
              </Chip>
              <Chip startContent={<Briefcase />} color='success'>
                Internship
              </Chip>
              <Chip startContent={<Briefcase />} color='warning'>
                Freelance
              </Chip>
            </div>
            <Divider />
            <div className='text-2xl font-semibold'>Recruiter</div>
            <div>
              <User
                name='D.B. Cooper'
                description='Recruiter @ Apple, Inc.'
                avatarProps={{
                  src: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
                }}
              />
            </div>
          </div>
        </div>
        <div className='basis-2/3'>
          <div className='flex flex-col gap-3'>
            <div>
              <div className='text-2xl font-semibold'>Company Overview</div>
              <Text variant='body'>
                Apple, Inc. is a world-renowned technology company known for
                pioneering innovation and iconic, user-centric products that
                have changed the way we live and connect.
              </Text>
            </div>
            <div>
              <div className='text-2xl font-semibold'>Description</div>
              <Text variant='body'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                blandit turpis dui, a elementum nulla malesuada eu. Phasellus in
                erat in dui cursus ultrices eget ut ligula. Maecenas fringilla,
                ex non vehicula venenatis, velit massa aliquet purus, id
                ultricies enim risus eget augue. Vestibulum imperdiet magna a
                accumsan tempus. Duis sollicitudin sem eu odio iaculis aliquet.
                Phasellus erat velit, rhoncus a aliquet sollicitudin, lobortis
                quis orci. Proin commodo tortor sit amet nunc condimentum
                rutrum. Fusce et erat quam. Maecenas erat nisi, porttitor et
                lacus quis, eleifend venenatis quam. Nulla vel sapien a ipsum
                pretium pharetra.
              </Text>
            </div>
            <div>
              <div className='text-2xl font-semibold'>Requirements</div>
              <Text variant='body'>
                Bachelor&apos;s or Master&apos;s Degree: A degree in Computer
                Science, Software Engineering, or a related field is typically
                required. iOS Development Expertise: Strong proficiency in iOS
                app development using Swift and Objective-C, along with a deep
                understanding of iOS.
              </Text>
            </div>
            <div>
              <div className='text-2xl font-semibold'>Responsibilities</div>
              <Text variant='body'>
                Design, develop, and maintain innovative and high-quality iOS
                applications for Apple&apos;s ecosystem.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
