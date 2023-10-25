import { Avatar } from '@nextui-org/avatar';
import { Card, CardBody, CardHeader, CardFooter } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Chip } from '@nextui-org/chip';
import {
  ExternalLink,
  Facebook,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  MapPin,
  Twitter,
  UserPlus,
  Youtube,
} from 'lucide-react';
import { Button } from '@nextui-org/button';

export default function Page({ params }: { params: { id: number } }) {
  return (
    <>
      <div className='flex flex-col md:flex-row items-start justify-start gap-3'>
        <div className='basis-1/4'>
          <div className='flex flex-row md:flex-col gap-3'>
            <div>
              <Card>
                <CardBody>
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Avatar
                      isBordered
                      color='default'
                      src={`https://i.pravatar.cc/150?u=${params.id}`}
                      className='h-full w-full'
                    />
                    <h1 className='md:text-3xl sm:text-2xl font-semibold'>
                      User {params.id}
                    </h1>
                    <h1 className='md:text-xl sm:text-medium font-semibold'>
                      <div className='flex items-center gap-1'>
                        <MapPin /> Cupertino, CA
                      </div>
                    </h1>
                    {params.id % 2 == 0 ? (
                      <Chip color='primary'>Developer</Chip>
                    ) : (
                      <Chip color='secondary'>
                        Recruiter @ Microsoft Corporation
                      </Chip>
                    )}
                    <Button
                      color='default'
                      variant='solid'
                      startContent={<UserPlus />}
                      size='sm'
                    >
                      Connect
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div>
              <Card>
                <CardBody>
                  <h1 className='md:text-3xl sm:text-2xl font-semibold mb-3'>
                    Socials
                  </h1>
                  <div className='flex flex-col gap-1'>
                    <Button
                      color='default'
                      variant='ghost'
                      startContent={<Github />}
                    >
                      GitHub
                    </Button>
                    <Button
                      color='primary'
                      variant='ghost'
                      startContent={<Facebook />}
                    >
                      Facebook
                    </Button>
                    <Button
                      color='secondary'
                      variant='ghost'
                      startContent={<Instagram />}
                    >
                      Instagram
                    </Button>
                    <Button
                      color='primary'
                      variant='ghost'
                      startContent={<Linkedin />}
                    >
                      LinkedIn
                    </Button>
                    <Button
                      color='primary'
                      variant='ghost'
                      startContent={<Twitter />}
                    >
                      Twitter
                    </Button>
                    <Button
                      color='danger'
                      variant='ghost'
                      startContent={<Youtube />}
                    >
                      YouTube
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
        <div className='basis-3/4'>
          <div className='flex flex-col gap-3'>
            <Card>
              <CardHeader>
                <h1 className='text-3xl font-medium'>About Me</h1>
              </CardHeader>
              <CardBody>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                auctor urna ante, quis suscipit nisl dictum eu. Nulla aliquam
                suscipit nulla eu gravida. Curabitur commodo lacus at magna
                dignissim, sed tempus est varius. Ut dignissim metus egestas,
                ultrices sem quis, cursus risus. Nulla placerat nibh et neque
                scelerisque gravida. Integer ligula nibh, lacinia a suscipit
                sed, finibus id mauris. Vestibulum id eleifend quam, vel
                imperdiet purus. Pellentesque commodo nunc lectus. Nulla id
                dolor quis enim iaculis aliquet eu nec arcu. Aliquam erat
                volutpat.
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h1 className='text-3xl font-medium'>Projects</h1>
              </CardHeader>
              <CardBody>
                <div className='grid w-full gap-3 md:grid-cols-2 sm:grid-cols-1'>
                  <div>
                    <Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
                      <CardHeader className='flex gap-3'>
                        <div className='flex flex-col'>
                          <p className='text-md font-semibold pb-3'>
                            To-Do List
                          </p>
                          <div className='flex flex-row flex-wrap gap-1'>
                            <Chip color='default' variant='faded'>
                              Next.js
                            </Chip>
                            <Chip color='default' variant='faded'>
                              NextUI
                            </Chip>
                            <Chip color='default' variant='faded'>
                              Firebase
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <p>Helps users keep track of what they need to do.</p>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Button
                          color='default'
                          variant='ghost'
                          startContent={<Github />}
                          endContent={<ExternalLink size={15} />}
                          size='sm'
                        >
                          View repository
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <div>
                    <Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
                      <CardHeader className='flex gap-3'>
                        <div className='flex flex-col'>
                          <p className='text-md font-semibold pb-3'>
                            To-Do List
                          </p>
                          <div className='flex flex-row flex-wrap gap-1'>
                            <Chip color='default' variant='faded'>
                              Next.js
                            </Chip>
                            <Chip color='default' variant='faded'>
                              NextUI
                            </Chip>
                            <Chip color='default' variant='faded'>
                              Firebase
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <p>Helps users keep track of what they need to do.</p>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Button
                          color='default'
                          variant='ghost'
                          startContent={<Github />}
                          endContent={<ExternalLink size={15} />}
                          size='sm'
                        >
                          View repository
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                  <div>
                    <Card className='hover:bg-slate-100 dark:hover:bg-slate-800'>
                      <CardHeader className='flex gap-3'>
                        <div className='flex flex-col'>
                          <p className='text-md font-semibold pb-3'>
                            To-Do List
                          </p>
                          <div className='flex flex-row flex-wrap gap-1'>
                            <Chip color='default' variant='faded'>
                              Next.js
                            </Chip>
                            <Chip color='default' variant='faded'>
                              NextUI
                            </Chip>
                            <Chip color='default' variant='faded'>
                              Firebase
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <p>Helps users keep track of what they need to do.</p>
                      </CardBody>
                      <Divider />
                      <CardFooter>
                        <Button
                          color='default'
                          variant='ghost'
                          startContent={<Github />}
                          endContent={<ExternalLink size={15} />}
                          size='sm'
                        >
                          View repository
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h1 className='text-3xl font-medium'>Skills</h1>
              </CardHeader>
              <CardBody>
                <div className='flex flex-row flex-wrap gap-1'>
                  <Chip color='default' variant='faded'>
                    HTML
                  </Chip>
                  <Chip color='default' variant='faded'>
                    CSS
                  </Chip>
                  <Chip color='default' variant='faded'>
                    Java
                  </Chip>
                  <Chip color='default' variant='faded'>
                    React
                  </Chip>
                  <Chip color='default' variant='faded'>
                    Next.js
                  </Chip>
                  <Chip color='default' variant='faded'>
                    PHP
                  </Chip>
                  <Chip color='default' variant='faded'>
                    Python
                  </Chip>
                  <Chip color='default' variant='faded'>
                    Perl
                  </Chip>
                  <Chip color='default' variant='faded'>
                    Ruby
                  </Chip>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h1 className='text-3xl font-medium'>Education</h1>
              </CardHeader>
              <CardBody>
                <div className='flex flex-row gap-3 items-center'>
                  <GraduationCap size={48} />
                  <div className='flex flex-col gap-1'>
                    <div>
                      <h1 className='font-semibold'>East Bumble University</h1>
                      <h1 className='font-semibold text-small'>
                        <div className='flex items-center gap-1'>
                          <MapPin /> Cupertino, CA
                        </div>
                      </h1>
                      <h1>Bachelor of Science - BS, Computer Science</h1>
                      <h1>September 2020-May 2024</h1>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h1 className='text-3xl font-medium'>Work History</h1>
              </CardHeader>
              <CardBody>
                {' '}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                auctor urna ante, quis suscipit nisl dictum eu. Nulla aliquam
                suscipit nulla eu gravida. Curabitur commodo lacus at magna
                dignissim, sed tempus est varius. Ut dignissim metus egestas,
                ultrices sem quis, cursus risus. Nulla placerat nibh et neque
                scelerisque gravida. Integer ligula nibh, lacinia a suscipit
                sed, finibus id mauris. Vestibulum id eleifend quam, vel
                imperdiet purus. Pellentesque commodo nunc lectus. Nulla id
                dolor quis enim iaculis aliquet eu nec arcu. Aliquam erat
                volutpat.
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
