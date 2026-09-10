"use client";

import { privateLinks } from "@/tools/pages-links";
import Link from "next/link";
import React from "react";
import { Icon } from "./Icon";
import { usePathname } from "next/navigation";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import Image from "next/image";
import { useSession } from "next-auth/react";

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
        className="max-h-8 aspect-square flex-[1] rounded-full block"
      >
        {user?.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            quality={100}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon
            icon={faUserCircle}
            className={`bg-background text-accent aspect-square !h-8 !w-8 mx-auto !block ring-2 ${pathname === "/profile" ? "ring-white/80" : "ring-white/30"} rounded-full`}
          />
        )}
      </Link>

      {privateLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={getNavLinkClass(pathname, link.path)}
        >
          <Icon icon={link.icon} size="lg" />
        </Link>
      ))}

      <Link
        href={"/settings"}
        className={getNavLinkClass(pathname, "/settings")}
      >
        <Icon icon={faGear} size="lg" />
      </Link>
    </div>
  );
};
