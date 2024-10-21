"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@nextui-org/navbar";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { Badge } from "@nextui-org/badge";
import { Kbd } from "@nextui-org/kbd";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { link as linkStyles } from "@nextui-org/theme";
// @ts-ignore
import NextLink from "next/link";
import clsx from "clsx";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/home/theme-switch";
import {
  TwitterIcon,
  GithubIcon,
  DiscordIcon,
  SearchIcon,
  Logo,
} from "@/components/home/icons";
import { logoutAction } from "@/app/(main)/(auth)/login/action";
import { BaseResponse } from "@/types";
import { CustomError } from "@/types/error/Error";
import { ErrorCode } from "@/types/error/ErrorCode";
import { useGetUserContext } from "@/app/UserContext";
import { getCookie } from "@/utils/cookies";

export const Navbar = () => {
  const currentPath = usePathname();

  const router = useRouter();

  const { isCookiePresent, deleteCookie } = useGetUserContext();

  async function clickToLogout() {
    try {
      await logoutAction(getCookie().id).then((res: BaseResponse<null>) => {
        if (res.success) {
          toast.success("退出登录成功！");
          router.push(currentPath);
        } else {
          toast.error("退出登录失败，请联系管理员！");
        }
        // 无论是否退出成功，都要把 cookie 删除
        deleteCookie();
      });
    } catch (error) {
      deleteCookie();
      // 异常统一被 响应拦截器捕获
      if (error instanceof CustomError) {
        if (
          error.code === ErrorCode.NOT_LOGIN.code ||
          error.code === ErrorCode.TOKEN_EXPIRE.code
        ) {
          router.push(siteConfig.innerLinks.login);
        }
      } else {
        toast.error(ErrorCode.NOT_KNOWN.message);
      }
    }
  }

  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-default-100",
        input: "text-sm",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <NextUINavbar shouldHideOnScroll maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">CNI-BBS</p>
          </NextLink>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href} isActive={currentPath === item.href}>
              <NextLink
                className={clsx(
                  linkStyles({
                    color: currentPath === item.href ? "primary" : "foreground",
                  }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium",
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.discord}>
            <DiscordIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>
        <NavbarItem
          className={clsx({
            hidden: isCookiePresent,
            // hidden: false,
          })}
        >
          <Button
            as={Link}
            color="primary"
            href={siteConfig.innerLinks.login}
            variant="flat"
          >
            Sign In
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href={siteConfig.innerLinks.dashboard}
            variant="flat"
          >
            dashboard
          </Button>
        </NavbarItem>
        <Dropdown
          showArrow
          classNames={{
            base: "before:bg-default-200", // change arrow background
            content: "p-0 border-small border-divider bg-background",
          }}
          radius="sm"
        >
          <Badge
            className={clsx({
              hidden: !isCookiePresent,
              // hidden: true,
            })}
            color="danger"
            content="5"
          >
            <DropdownTrigger>
              <Avatar
                isBordered
                className={clsx({
                  hidden: !isCookiePresent,
                  // hidden: true,
                })}
                color={"danger"}
                radius="lg"
                src="https://blogback.yannqing.com/api/v2/objects/avatar/0vqxqul8pu2skmwokn.jpg"
              />
            </DropdownTrigger>
          </Badge>

          <DropdownMenu
            aria-label="Custom item styles"
            className="p-3"
            disabledKeys={["profile"]}
            itemClasses={{
              base: [
                "rounded-md",
                "text-default-500",
                "transition-opacity",
                "data-[hover=true]:text-foreground",
                "data-[hover=true]:bg-default-100",
                "dark:data-[hover=true]:bg-default-50",
                "data-[selectable=true]:focus:bg-default-50",
                "data-[pressed=true]:opacity-70",
                "data-[focus-visible=true]:ring-default-500",
              ],
            }}
          >
            <DropdownSection showDivider aria-label="Profile & Actions">
              <DropdownItem
                key="profile"
                isReadOnly
                className="h-14 gap-2 opacity-100"
              >
                <User
                  avatarProps={{
                    size: "sm",
                    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                  }}
                  classNames={{
                    name: "text-default-600",
                    description: "text-default-500",
                  }}
                  description="@jrgarciadev"
                  name="Junior Garcia"
                />
              </DropdownItem>
              <DropdownItem key="dashboard">Dashboard</DropdownItem>
              <DropdownItem key="settings">Settings</DropdownItem>
              <DropdownItem
                key="new_project"
                endContent="+"
              >
                New Project
              </DropdownItem>
            </DropdownSection>

            <DropdownSection showDivider aria-label="Preferences">
              <DropdownItem key="quick_search" shortcut="⌘K">
                Quick search
              </DropdownItem>
              <DropdownItem
                key="theme"
                isReadOnly
                className="cursor-default"
                endContent={
                  <select
                    className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                    id="theme"
                    name="theme"
                  >
                    <option>System</option>
                    <option>Dark</option>
                    <option>Light</option>
                  </select>
                }
              >
                Theme
              </DropdownItem>
            </DropdownSection>

            <DropdownSection aria-label="Help & Feedback">
              <DropdownItem key="help_and_feedback">
                Help & Feedback
              </DropdownItem>
              <DropdownItem key="logout" onPress={clickToLogout}>
                Log Out
              </DropdownItem>
            </DropdownSection>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        {searchInput}
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === siteConfig.navMenuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                href="#"
                size="lg"
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </NextUINavbar>
  );
};
