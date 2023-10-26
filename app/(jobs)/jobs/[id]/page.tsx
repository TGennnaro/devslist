import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import { MapPin, Send } from 'lucide-react';
import { Button } from '@nextui-org/button';
import Text from '@/components/Text';

import { Metadata } from 'next';

const metadata: Metadata = {
  title: 'Job Posting',
  description: 'Find your next job',
};

export default function Page({ params }: { params: { id: number } }) {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-row gap-5'>
          <div>
            <div className='text-3xl font-bold'>Job Posting {params.id}</div>
            <div className='text-medium font-semibold'>Apple, Inc.</div>
          </div>
          <div>
            <Button endContent={<Send />} variant='solid' color='secondary'>
              Apply Now
            </Button>
          </div>
        </div>
        <div className='text-2xl'>Location</div>
        <Text variant='body'>
          <div className='flex items-center gap-1'>
            <MapPin /> Cupertino, CA
          </div>
        </Text>
        <div className='text-2xl'>Job Type</div>
        <Text variant='body'>
          <div className='flex items-center gap-1'>
            <MapPin /> Cupertino, CA
          </div>
        </Text>
        <div className='text-2xl'>Job Description</div>
        <Text variant='body'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          blandit turpis dui, a elementum nulla malesuada eu. Phasellus in erat
          in dui cursus ultrices eget ut ligula. Maecenas fringilla, ex non
          vehicula venenatis, velit massa aliquet purus, id ultricies enim risus
          eget augue. Vestibulum imperdiet magna a accumsan tempus. Duis
          sollicitudin sem eu odio iaculis aliquet. Phasellus erat velit,
          rhoncus a aliquet sollicitudin, lobortis quis orci. Proin commodo
          tortor sit amet nunc condimentum rutrum. Fusce et erat quam. Maecenas
          erat nisi, porttitor et lacus quis, eleifend venenatis quam. Nulla vel
          sapien a ipsum pretium pharetra.
        </Text>
      </div>
    </>
  );
}
