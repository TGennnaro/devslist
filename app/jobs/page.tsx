"use client";
import { title } from "@/components/primitives";
import { FaSearch } from "react-icons/fa";
import {
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
} from "@nextui-org/react";
import { JobCard } from "@/components/JobCard";

export default function Jobs() {
  return (
    <>
      <h1 className={title()}>Jobs</h1>

      <div className="my-8">
        <Input
          type="email"
          label="Search"
          placeholder="Job title, location, company, requirements, ..."
          startContent={<FaSearch />}
        />
      </div>

      <div className="flex flex-row gap-3 items-center justify-center">
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="shadow">Role</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem>Any Role</DropdownItem>
              <DropdownItem>Full Time</DropdownItem>
              <DropdownItem>Part Time</DropdownItem>
              <DropdownItem>Internship</DropdownItem>
              <DropdownItem>Freelance</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button variant="shadow">Salary</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem>todo</DropdownItem>
              <DropdownItem>todo</DropdownItem>
              <DropdownItem>todo</DropdownItem>
              <DropdownItem>todo</DropdownItem>
              <DropdownItem>todo</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5 my-8">
        <JobCard />
        <JobCard />
        <JobCard />
        <JobCard />
      </div>

      <div className="flex flex-row items-center justify-center my-52">
        <Pagination total={5} initialPage={1} />
      </div>
    </>
  );
}
