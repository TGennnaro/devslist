import { Input } from "@nextui-org/input";
import { FaSearch } from "react-icons/fa";

export default function JobSearchBar() {
  return (
    <Input
      type="email"
      label="Search"
      placeholder="Job title, location, company, requirements, ..."
      startContent={<FaSearch />}
    />
  );
}
