"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { Icon } from "@/app/components/Icon";
import { useSession } from "next-auth/react";
import { SignUpMethods } from "@/model/user/types/SignUpMethods.enum";
import { _Translator, useTranslations } from "next-intl";

const getSettingsLinks = (t: _Translator) => [
  { title: t("general.title"), path: "/settings", icon: faGear },
  {
    title: t("security.title"),
    path: "/settings/security",
    icon: faShieldHalved,
  },
];

export default function SettingsSidebar() {
  const { data } = useSession();
  const pathname = usePathname();
  const t = useTranslations("settings");

  const userSignupMethod = data?.user?.signUpMethod;

  const settingsLinks = getSettingsLinks(t);

  const allowedLinks = settingsLinks.filter((link) => {
    if (
      link.path === "/settings/security" &&
      userSignupMethod !== SignUpMethods.EMAIL
    ) {
      return false;
    }

    return true;
  });

  return (
    <aside className="w-full shrink-0 lg:w-60 bg-primary rounded-2xl md:sticky top-24 lg:h-full">
      <nav className="flex h-full gap-2 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-2 lg:flex-col lg:overflow-visible lg:rounded-2xl lg:p-3">
        {allowedLinks.map((link) => {
          const active = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 font-bold transition-colors lg:whitespace-normal ${
                active
                  ? "bg-accent/15 text-accent"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon icon={link.icon} className="text-sm" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
