"use client";
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Avatar, Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  User,
} from "@nextui-org/react";
import CountUp from "react-countup";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaReact } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block lg:w-2/3 text-center justify-center">
          <h1 className={title()}>Welcome to&nbsp;</h1>
          <h1 className={title({ color: "blue" })}>
            <TypeAnimation
              sequence={["DevsList", 1000]}
              wrapper="span"
              speed={25}
              repeat={Infinity}
            />
          </h1>
          <h2 className={subtitle({ class: "mt-4" })}>
            The all-in-one jobs platform for developers.
          </h2>
        </div>
        <NextLink href="/">
        <Button color="primary" size="lg">
          Get started
        </Button>
        </NextLink>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block lg:w-2/3 text-center justify-center">
          <h1 className={title()}>Why&nbsp;</h1>
          <h1 className={title({ color: "blue" })}>DevsList</h1>
          <h1 className={title()}>?</h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-4 mt-8">
          <div>
            <Card className="max-w-[400px] aspect-auto bg-gradient-to-r from-slate-600 to-slate-800 text-white">
              <CardHeader className="flex gap-3 font-semibold">
                <FaReact size={40} /> Developer-Oriented
              </CardHeader>
              <CardBody className="pt-2">
                <p>
                  For developers, by developers. We'll only show you tech jobs
                  so you can better narrow down your job search. Uniquely
                  showcase your projects and skills on your own profile.
                </p>
              </CardBody>
            </Card>
          </div>
          <div>
            <Card className="max-w-[400px] aspect-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white">
              <CardHeader className="flex gap-3 font-semibold">
                <FaMagnifyingGlass size={40} /> Interactive Job Searching
              </CardHeader>
              <CardBody className="pt-2">
                <p>
                  Filter jobs by skills, salary, location, and company ratings.
                  Find jobs anywhere around the world or close to you with our
                  unique interactive map.
                </p>
              </CardBody>
            </Card>
          </div>
          <div>
            <div>
              <Card className="max-w-[400px] aspect-auto bg-gradient-to-r from-violet-600 to-violet-800 text-white">
                <CardHeader className="flex gap-3 font-semibold">
                  <BsSendFill size={40} /> Easy Application Process
                </CardHeader>
                <CardBody className="pt-2">
                  <p>
                    Apply to jobs easier than ever before. Customize your
                    profile, upload your resume, and apply! Keep tabs on all of
                    your applications with ease.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <h1 className={`${title()}`}>Hear from our users</h1>

        <div className="grid lg:grid-cols-3 gap-4 mt-8">
          <div>
            <Card className="max-w-[400px] aspect-auto">
              <CardHeader className="flex gap-3">
                <User
                  name="John Doe"
                  description="Software Engineer"
                  avatarProps={{
                    src: "https://i.pravatar.cc/150?u=a",
                  }}
                />
              </CardHeader>
              <CardBody className="pt-2">
                <p>
                  DevsList transformed my job search. As a software engineer, I
                  was overwhelmed, but this platform simplified everything. The
                  user-friendly interface and accurate job matching made finding
                  internships and job listings a breeze. The interview and
                  resume resources were invaluable. Thanks to DevList, I secured
                  my dream internship and launched my tech career.
                </p>
              </CardBody>
            </Card>
          </div>
          <div>
            <div>
              <Card className="max-w-[400px] aspect-auto">
                <CardHeader className="flex gap-3">
                  <User
                    name="D.B. Cooper"
                    description="CS Student"
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=b",
                    }}
                  />
                </CardHeader>
                <CardBody className="pt-2">
                  <p>
                    DevsList made my job search a breeze as a CS student looking
                    for a summer internship. The personalized job
                    recommendations were spot on, and the application process
                    was seamless. The responsive support team felt like a true
                    partner. Thanks to DevList, I found a fantastic entry-level
                    role within weeks. It's a must-visit for CS students and
                    developers seeking meaningful opportunities.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
          <div>
            <div>
              <Card className="max-w-[400px] aspect-auto">
                <CardHeader className="flex gap-3">
                  <User
                    name="Jane Doe"
                    description="iOS App Developer"
                    avatarProps={{
                      src: "https://i.pravatar.cc/150?u=c",
                    }}
                  />
                </CardHeader>
                <CardBody className="pt-2">
                  <p>
                    DevsList is a game-changer for developers. It stands out
                    with its quality job listings and tailored features. The
                    developer profiles and portfolio tools allowed me to
                    showcase my skills effectively. The weekly newsletter kept
                    me updated on industry trends and job opportunities. Thanks
                    to DevsList, I found a role that aligns perfectly with my
                    skills and ambitions.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="w-full mx-auto px-6 md:px-12 xl:px-6 py-8">
          <div className="relative py-16">
            <div
              aria-hidden="true"
              className="absolute inset-0 h-max w-full m-auto grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20"
            >
              <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
              <div className="blur-[106px] h-56 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
            </div>
            <div className="relative">
              <div className="flex items-center justify-center -space-x-2">
                <Avatar src="https://i.pravatar.cc/150?u=1" size="sm" />
                <Avatar src="https://i.pravatar.cc/150?u=2" size="md" />
                <Avatar src="https://i.pravatar.cc/150?u=3" size="lg" />
                <Avatar src="https://i.pravatar.cc/150?u=4" size="md" />
                <Avatar src="https://i.pravatar.cc/150?u=5" size="sm" />
              </div>
              <div className="mt-6 m-auto space-y-6 md:w-8/12 lg:w-7/12">
                <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white md:text-5xl">
                  Let's find your career
                </h1>
                <p className="text-center text-xl text-gray-600 dark:text-gray-300">
                  Let us help you discover over{" "}
                  <b>
                    <CountUp end={10000} scrollSpyOnce />
                  </b>{" "}
                  jobs from{" "}
                  <b>
                    <CountUp end={100} scrollSpyOnce />
                  </b>{" "}
                  different companies{" "}
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <Button color="primary" size="lg">
                    Get started
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
