'use client';
import { useState } from 'react';
import { Card, CardBody } from '@nextui-org/card';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { RadioGroup, Radio } from '@nextui-org/radio';
import { Chip } from '@nextui-org/chip';
import { Calendar, Eye, Plus, Send } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@nextui-org/popover';
import { DayPicker } from 'react-day-picker';
import { useMutation } from 'react-query';
import { FormEvent, useRef } from 'react';
import 'react-day-picker/dist/style.css';
import { useRouter } from 'next/navigation';

export default function JobPostingForm() {
  const [payTypeSelectionHidden, setPayTypeSelectionHidden] = useState(false);
  const [hourlyInputHidden, setHourlyInputHidden] = useState(true);
  const [salaryInputHidden, setSalaryInputHidden] = useState(true);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [skillValue, setSkillValue] = useState('');
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append('skills', JSON.stringify(skillsList));
      setIsPosting(true);
      return fetch('/api/jobs', {
        method: 'POST',
        body: formData,
      }).then((response) => {
        setIsPosting(false);
        router.push('/jobs');
      });
    },
  });

  function handleShowPayTypeSelection() {
    setSalaryInputHidden(true);
    setHourlyInputHidden(true);
    payTypeSelectionHidden
      ? setPayTypeSelectionHidden(false)
      : setPayTypeSelectionHidden(true);
  }

  function handleShowHourlyInput() {
    setSalaryInputHidden(true);
    hourlyInputHidden
      ? setHourlyInputHidden(false)
      : setHourlyInputHidden(true);
  }

  function handleShowSalaryInput() {
    setHourlyInputHidden(true);
    salaryInputHidden
      ? setSalaryInputHidden(false)
      : setSalaryInputHidden(true);
  }

  function addToSkillsList() {
    if (skillValue) {
      skillsList.includes(skillValue)
        ? console.log('already exists')
        : setSkillsList([...skillsList, skillValue]);
      setSkillValue('');
    }
  }

  return (
    <form onSubmit={mutation.mutate}>
      <div className='flex items-center justify-center mt-8 mb-20'>
        <div className='basis-full'>
          <Card>
            <CardBody>
              <div className='text-2xl font-semibold my-5'>
                Some basic info first
              </div>
              <div className='flex flex-col gap-5'>
                <Input
                  name='jobTitle'
                  label='Job Title'
                  labelPlacement='outside'
                  placeholder='Job Title'
                  variant='bordered'
                  radius='sm'
                  isRequired
                />
                <RadioGroup label='Job type' isRequired name='jobType'>
                  <Radio value='Full-Time'>Full-Time</Radio>
                  <Radio value='Part-Time'>Part-Time</Radio>
                  <Radio value='Internship'>Internship</Radio>
                  <Radio value='Freelance'>Freelance</Radio>
                </RadioGroup>
              </div>
              <div className='text-2xl font-semibold my-5'>
                Let&apos;s learn more about this job
              </div>
              <div className='flex flex-col gap-5'>
                <Input
                  name='jobDescription'
                  label='Job description'
                  labelPlacement='outside'
                  placeholder='Job description'
                  variant='bordered'
                  radius='sm'
                  isRequired
                />
                <Input
                  name='jobResponsibilities'
                  label='Job responsibilities'
                  labelPlacement='outside'
                  placeholder='Job responsibilities'
                  variant='bordered'
                  radius='sm'
                  isRequired
                />
                <Input
                  name='workAddress'
                  label='Work address'
                  labelPlacement='outside'
                  placeholder='Work address'
                  variant='bordered'
                  radius='sm'
                  isRequired
                />

                <div className='flex flex-row gap-3 items-center'>
                  <Input
                    name='requiredSkill'
                    label='Enter one required skill'
                    labelPlacement='outside'
                    placeholder='Enter one required skill'
                    variant='bordered'
                    radius='sm'
                    value={skillValue}
                    onValueChange={setSkillValue}
                    endContent={
                      <button type='button'>
                        <Plus onClick={() => addToSkillsList()} />
                      </button>
                    }
                  />
                </div>
                {skillsList.length != 0 ? (
                  <Card>
                    <CardBody>
                      <div className='flex flex-row flex-wrap items-center gap-2'>
                        {skillsList.map((skill) => {
                          return (
                            <Chip
                              key={skill}
                              onClose={() =>
                                setSkillsList((skillsList) =>
                                  skillsList.filter(
                                    (item: string) => item !== skill
                                  )
                                )
                              }
                            >
                              {skill}
                            </Chip>
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card>
                ) : null}
              </div>
              <div className='text-2xl font-semibold my-5'>
                Job posting settings
              </div>
              <div className='flex flex-col gap-5'>
                <Input
                  name='expirationDate'
                  label='Job posting expiration date'
                  labelPlacement='outside-left'
                  isReadOnly
                  placeholder={selected?.toLocaleDateString()}
                  value={selected?.toLocaleDateString()}
                  variant='bordered'
                  radius='sm'
                  endContent={
                    <Popover
                      placement='bottom'
                      showArrow={true}
                      isOpen={isDateSelectorOpen}
                      onOpenChange={(open) => setIsDateSelectorOpen(open)}
                    >
                      <PopoverTrigger>
                        <button type='button'>
                          <Calendar />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className='px-1 py-2'>
                          <DayPicker
                            mode='single'
                            required
                            selected={selected}
                            onSelect={setSelected}
                            onDayClick={() => setIsDateSelectorOpen(false)}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  }
                />

                <Checkbox
                  defaultSelected
                  onClick={() => handleShowPayTypeSelection()}
                  name='showPayRate'
                  value='yes'
                >
                  Display pay rate (recommended){' '}
                </Checkbox>
                {payTypeSelectionHidden ? null : (
                  <RadioGroup label='Select pay type' isRequired name='payType'>
                    <Radio
                      value='hourly'
                      onChange={() => handleShowHourlyInput()}
                    >
                      Hourly rate
                    </Radio>

                    <Radio
                      value='salary'
                      onChange={() => handleShowSalaryInput()}
                    >
                      Yearly rate (salary)
                    </Radio>
                  </RadioGroup>
                )}
                {salaryInputHidden ? null : (
                  <Input
                    name='salary'
                    label='Salary'
                    labelPlacement='outside'
                    placeholder='Salary'
                    variant='bordered'
                    radius='sm'
                    isRequired
                  />
                )}
                {hourlyInputHidden ? null : (
                  <Input
                    name='hourlyRate'
                    label='Hourly rate'
                    labelPlacement='outside'
                    placeholder='Hourly rate'
                    variant='bordered'
                    radius='sm'
                    isRequired
                  />
                )}
              </div>

              <div className='flex flex-row items-center gap-3 mt-8'>
                <Button
                  variant='flat'
                  color='primary'
                  onClick={() => console.log('post')}
                  endContent={<Send />}
                  type='submit'
                  isDisabled={isPosting}
                  isLoading={isPosting}
                >
                  Post Job
                </Button>
                <Button
                  variant='flat'
                  color='secondary'
                  onClick={() => console.log('preview')}
                  endContent={<Eye />}
                >
                  Preview Job Posting
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </form>
  );
}
