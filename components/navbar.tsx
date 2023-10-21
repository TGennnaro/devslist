"use client";

import {
  Avatar,
  Badge,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Navbar as NextUINavbar,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { FaEnvelope } from "react-icons/fa";
import { link as linkStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import clsx from "clsx";
import NextLink from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const session = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setIsScrolled(window.scrollY > 1);
    });
  });
  return (
    <NextUINavbar
      maxWidth="xl"
      position="sticky"
      shouldHideOnScroll={false}
      className={`border-b transition-all ${
        isScrolled
          ? "border-gray-300 dark:border-gray-800 shadow-lg"
          : "border-background"
      }`}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex items-center justify-start gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">DevsList</p>
          </NextLink>
        </NavbarBrand>
        <ul className="justify-start hidden gap-4 ml-2 sm:flex">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden gap-2 sm:flex">
          <ThemeSwitch />
        </NavbarItem>

        {session.status === "authenticated" ? (
          <>
            <Badge color="danger" content={50} shape="circle" size="sm">
              <NextLink href="#">
                <FaEnvelope size={25} />
              </NextLink>
            </Badge>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name="User"
                  size="sm"
                  src="https://i.pravatar.cc/150?u=a"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem>
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.data.user?.email}</p>
                </DropdownItem>
                <DropdownItem>Profile</DropdownItem>
                <DropdownItem>Applications</DropdownItem>
                <DropdownItem>Reviews</DropdownItem>
                <DropdownItem showDivider>Settings</DropdownItem>
                <DropdownItem color="danger" onClick={() => signOut()}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <NavbarItem>
            <Button color="primary" variant="flat" onClick={() => signIn()}>
              Sign In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="pl-4 sm:hidden basis-1" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="flex flex-col gap-2 mx-4 mt-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <Divider />
          {session.status === "authenticated" ? (
            <>
              <NavbarMenuItem>
                <span className="font-semibold">
                  {session.data.user?.email}
                </span>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" href="#" size="lg">
                  Profile
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" href="#" size="lg">
                  Applications
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" href="#" size="lg">
                  Reviews
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="foreground" href="#" size="lg">
                  Settings
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link
                  color="danger"
                  href="#"
                  onClick={() => signOut()}
                  size="lg"
                >
                  Log Out
                </Link>
              </NavbarMenuItem>
            </>
          ) : (
            <>
              <NavbarMenuItem>
                <Link color="primary" href="/login" size="lg">
                  Sign In
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="primary" href="/register" size="lg">
                  Register
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
