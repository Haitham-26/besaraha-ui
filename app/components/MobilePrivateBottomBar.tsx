"use client";

import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import React from "react";
import { Icon } from "./Icon";
import { usePathname } from "@/i18n/navigation";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";

const mainPrivateNavLinks = [
  {
    path: "/messages",
    icon: faMessage,
  },
  {
    path: "/questions",
    icon: faComments,
  },
  {
    path: "/public-questions",
    icon: faBolt,
  },
  {
    path: "/settings",
    icon: faGear,
  },
];

const getNavLinkClass = (currentPathname: string, path: string) => `
  flex-[1]  relative font-bold transition-all duration-300 flex flex-col justify-center items-center gap-1 w-full md:w-auto
    ${
      currentPathname === path
        ? "text-accent"
        : "text-slate-300 hover:text-white"
    }
  `;

export const MobilePrivateBottomBar: React.FC = () => {
  const pathname = usePathname();
  const { data } = useSession();

  const user = data?.user;

  return (
    <div className="fixed lg:hidden bottom-0 w-full flex items-center px-4 py-2 max-h-12 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10 z-10">
      <Link
        href="/profile"
        className={`max-h-8 aspect-square rounded-full block overflow-hidden ring-2 ${pathname === "/profile" ? "ring-white/80" : "ring-white/30"}`}
      >
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={50}
            height={50}
            quality={100}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            icon={faUserCircle}
            className={`bg-background text-accent !h-8 !w-8 mx-auto !block rounded-[inherit]`}
          />
        )}
      </Link>

      {mainPrivateNavLinks.map((link) => {
        const isPublicQuestions = link.path === "/public-questions";

        if (isPublicQuestions) {
          return (
            <LocaleLink
              key={link.path}
              href={link.path}
              className={getNavLinkClass(pathname, link.path)}
            >
              <Icon icon={link.icon} size="lg" />
            </LocaleLink>
          );
        }

        return (
          <Link
            key={link.path}
            href={link.path}
            className={getNavLinkClass(pathname, link.path)}
          >
            <Icon icon={link.icon} size="lg" />
          </Link>
        );
      })}
    </div>
  );
};
