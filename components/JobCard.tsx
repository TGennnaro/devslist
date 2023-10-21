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

const generateRatingStars = (companyRating: number) => {
  const stars = [];
  let starsLeft = companyRating;

  for (let i = 0; i < 5; i++) {
    if (starsLeft >= 1.0) {
      // First generate filled stars
      stars.push(<BsStarFill key={i} color="gold" />);
      starsLeft -= 1.0;
    } else if (starsLeft >= 0.5) {
      // Then half stars
      stars.push(<BsStarHalf key={i} color="gold" />);
      starsLeft -= 0.5;
    } else {
      // Then empty stars
      stars.push(<BsStar key={i} color="gold" />);
    }
  }

  return stars;
};

export default function JobCard({
  position,
  company,
  companyLogo,
  companyRating,
  postedDate,
  expirationDate,
  location,
  pay,
  jobType,
  companyOverview,
  requirements,
  responsibilities,
}: {
  position: string;
  company: string;
  companyLogo: string;
  companyRating: number;
  postedDate: string;
  expirationDate: string;
  location: string;
  pay?: string;
  jobType: string;
  companyOverview: string;
  requirements: string;
  responsibilities: string;
}) {
  return (
    <Card className="hover:bg-slate-100 dark:hover:bg-slate-800">
      <CardHeader className="flex gap-3">
        <Image
          isBlurred
          alt="Company logo"
          height={40}
          radius="sm"
          src={companyLogo}
          width={40}
          className="dark:bg-gray-500 p-1"
        />
        <div className="flex flex-col">
          <p className="text-md">{position}</p>
          <p className="text-small text-default-500 flex items-center gap-1">
            <NextLink href="#" className="underline">
              {company}
            </NextLink>{" "}
            | {companyRating.toFixed(1)} {generateRatingStars(companyRating)}
          </p>
          <p className="text-small text-default-500 flex items-center gap-1">
            <FcClock /> Available until {expirationDate}
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex gap-1">
          <span className="font-semibold">Posted:</span>
          {postedDate}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Location:</span>
          <FaMapPin className="text-red-500" /> {location}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Pay:</span>
          <FcMoneyTransfer /> {pay}
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold">Type:</span>
          <FcWorkflow /> {jobType}
        </div>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcOrganization /> Company Overview
        </div>
        <p>{companyOverview}</p>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcCheckmark /> Requirements
        </div>
        <p>{requirements}</p>
        <div className="flex items-center gap-1 font-semibold pt-3">
          <FcList /> Responsibilities
        </div>
        <p>{responsibilities}</p>
      </CardBody>
      <CardFooter className="gap-3">
        <Button variant="flat" size="md">
          View Job
        </Button>
      </CardFooter>
    </Card>
  );
}
