import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Button,
} from "@nextui-org/react";
import NextLink from "next/link";
import { FaMapPin } from "react-icons/fa";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import {
  FcClock,
  FcList,
  FcOrganization,
  FcCheckmark,
  FcMoneyTransfer,
  FcWorkflow,
} from "react-icons/fc";

export const JobCard = () => {
  return (
    <Card className="hover:bg-slate-100 dark:hover:bg-slate-800">
      <CardHeader className="flex gap-3">
        <Image
          isBlurred
          alt="Company logo"
          height={40}
          radius="sm"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/488px-Apple_logo_black.svg.png"
          width={40}
          className="dark:bg-gray-500 p-1"
        />
        <div className="flex flex-col">
          <p className="text-md">Software Engineer, iOS</p>
          <p className="text-small text-default-500 flex items-center gap-1">
            <NextLink href="#" className="underline">
              Apple, Inc.
            </NextLink>{" "}
            | 3.5 <BsStarFill color="gold" />
            <BsStarFill color="gold" />
            <BsStarFill color="gold" />
            <BsStarHalf color="gold" />
            <BsStar color="gold" />
          </p>
          <p className="text-small text-default-500 flex items-center gap-1">
            <FcClock /> Available until October 31, 2023
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex gap-1">
          <span className="font-semibold">Posted:</span>
          October 31, 2023
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Location:</span>
          <FaMapPin className="text-red-500" /> Cupertino, CA
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Pay:</span>
          <FcMoneyTransfer /> $150,000/yr
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Type:</span>
          <FcWorkflow /> Full Time
        </div>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcOrganization /> Company Overview
        </div>
        <p>
          Apple, Inc. is a world-renowned technology company known for
          pioneering innovation and iconic, user-centric products that have
          changed the way we live and connect.
        </p>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcCheckmark /> Requirements
        </div>
        <p>
          Bachelor's or Master's Degree: A degree in Computer Science, Software
          Engineering, or a related field is typically required. iOS Development
          Expertise: Strong proficiency in iOS app development using Swift and
          Objective-C, along with a deep understanding of iOS.
        </p>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcList /> Responsibilities
        </div>
        <p>
          Design, develop, and maintain innovative and high-quality iOS
          applications for Apple's ecosystem.
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <Button variant="flat" size="md">
          View Job
        </Button>
      </CardFooter>
    </Card>
  );
};
