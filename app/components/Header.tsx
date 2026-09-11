"use client";

import Image from "next/image";
import React, { Fragment, useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { Drawer } from "./Drawer";
import { Button } from "./Button";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { privateLinks, publicLinks } from "@/tools/pages-links";
import { Popover } from "./Popover";
import { useSession } from "next-auth/react";
import { Icon } from "./Icon";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { Link as LocaleLink, usePathname } from "@/i18n/navigation";
import Link from "next/link";

const popoverItemClass =
  "flex items-center gap-2 px-4 py-2 font-bold text-slate-300 cursor-pointer hover:text-white hover:bg-white/5";

type HeaderProps = {
  token?: string;
};

export const Header: React.FC<HeaderProps> = ({ token }) => {
  const [open, setOpen] = useState(false);
  const [hideTopRow, setHideTopRow] = useState(false);

  const { data } = useSession();

  const user = data?.user;

  const pathname = usePathname();

  const isOnAuthPage = pathname.startsWith("/auth/");

  const links = token ? privateLinks : publicLinks;

  const LinkToUse = token ? Link : LocaleLink;

  const DesktopNavLinks = () => (
    <Fragment>
      {links.map((link) => {
        const active = pathname === link.path;
        const isPublicQuestions = link.path === "/public-questions";

        if (isPublicQuestions) {
          return (
            <LocaleLink
              key={link.path}
              href={link.path}
              className={`group relative flex items-center gap-2 px-4 py-2 font-bold transition-colors duration-200 ${
                active ? "text-accent" : "text-slate-300 hover:text-white"
              }`}
            >
              <span>{link.title}</span>
              <span
                className={`absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-accent transition-opacity duration-200 ${
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
              />
            </LocaleLink>
          );
        }

        return (
          <LinkToUse
            key={link.path}
            href={link.path}
            className={`group relative flex items-center gap-2 px-4 py-2 font-bold transition-colors duration-200 ${
              active ? "text-accent" : "text-slate-300 hover:text-white"
            }`}
          >
            <span>{link.title}</span>
            <span
              className={`absolute inset-x-3 -bottom-1 h-[2px] rounded-full bg-accent transition-opacity duration-200 ${
                active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
              }`}
            />
          </LinkToUse>
        );
      })}
    </Fragment>
  );

  const DrawerNavLinks = () => (
    <Fragment>
      {links.map((link) => (
        <LinkToUse
          key={link.path}
          href={link.path}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 w-full px-5 py-3 rounded-xl font-bold transition-colors ${
            pathname === link.path
              ? "bg-accent/15 text-accent"
              : "text-slate-300 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>{link.title}</span>
        </LinkToUse>
      ))}
    </Fragment>
  );

  useEffect(() => {
    if (isOnAuthPage || token) {
      return;
    }

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      if (currentScrollY < 80) {
        setHideTopRow(false);
      } else {
        setHideTopRow(currentScrollY > lastScrollY);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOnAuthPage, token]);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div
          className={`transition-[max-height,opacity] duration-400 ease-in-out lg:!max-h-none lg:!opacity-100 ${
            hideTopRow && !isOnAuthPage && !token
              ? "max-h-0 opacity-0"
              : "max-h-24 opacity-100"
          }`}
        >
          <div className="flex items-center justify-between h-20 gap-4">
            <LinkToUse href="/" className="flex items-center shrink-0">
              <Image
                src="/images/logo.png"
                alt="بصراحة"
                width={160}
                height={35}
                quality={100}
                className="brightness-110"
              />
            </LinkToUse>

            <nav className="hidden lg:flex items-center gap-1">
              <DesktopNavLinks />
            </nav>

            <div className="flex items-center gap-3">
              {token ? (
                <Fragment>
                  <Popover
                    trigger={({ open, toggle }) => (
                      <Button
                        onClick={toggle}
                        aria-haspopup="menu"
                        aria-expanded={open}
                        className="!bg-transparent !p-0 overflow-hidden rounded-full ring-2 ring-white/10 h-14 w-14 !shadow-none"
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
                            className="text-accent !w-full !h-full"
                          />
                        )}
                      </Button>
                    )}
                    classNames={{
                      panel: "w-max",
                      trigger: "!hidden md:!block",
                    }}
                  >
                    <div className="flex flex-col py-1">
                      <Link href="/profile" className={popoverItemClass}>
                        <Icon icon={faUser} />
                        <span>الملف الشخصي</span>
                      </Link>

                      <Link href="/settings" className={popoverItemClass}>
                        <Icon icon={faGear} />
                        <span>الإعدادات</span>
                      </Link>

                      <hr className="border-white/10" />

                      <div className="px-4 mt-2">
                        <LogoutButton />
                      </div>
                    </div>
                  </Popover>

                  <LogoutButton className="md:hidden" />
                </Fragment>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <LocaleLink
                    href="/login"
                    className="rounded-xl px-5 py-2.5 font-bold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    تسجيل الدخول
                  </LocaleLink>
                  <LocaleLink
                    href="/signup"
                    className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-bold text-white shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 hover:bg-accent/90"
                  >
                    <span>إنشاء حساب</span>
                  </LocaleLink>
                </div>
              )}

              {!token ? (
                <Button
                  onClick={() => setOpen(true)}
                  icon={faBarsStaggered}
                  className="lg:hidden w-10 h-10 shrink-0 !p-5 rounded-xl !bg-white/5 !text-white border !border-white/10 shadow-none hover:!bg-white/10"
                />
              ) : null}
            </div>
          </div>
        </div>

        {!token && !isOnAuthPage ? (
          <div
            className={`grid grid-cols-2 gap-2 pb-3 ${hideTopRow ? "pt-3" : ""} lg:hidden`}
          >
            <LocaleLink
              href="/login"
              className="flex items-center justify-center rounded-xl px-4 py-2.5 text-center font-bold text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              تسجيل الدخول
            </LocaleLink>
            <LocaleLink
              href="/signup"
              className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-center font-bold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
            >
              إنشاء حساب
            </LocaleLink>
          </div>
        ) : null}
      </div>

      <Drawer
        onClose={() => setOpen(false)}
        open={open}
        title={
          <Image src="/images/logo.png" alt="بصراحة" width={140} height={30} />
        }
      >
        <div className="flex flex-col gap-2">
          <DrawerNavLinks />
        </div>
      </Drawer>
    </header>
  );
};
