"use client";

import React from "react";
import { Button } from "./Button";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons/faRightFromBracket";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

type LogoutButtonProps = {
  className?: string;
};

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
}) => {
  const t = useTranslations("common");
  const locale = useLocale();

  const prefix = locale !== AppLangs.EN ? `/${locale}` : "";

  const logout = async () => {
    try {
      await NextClient("/auth/logout", {
        method: "POST",
      });

      signOut({ callbackUrl: `${prefix}/`, redirect: true });
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  return (
    <Button
      onClick={logout}
      icon={faRightFromBracket}
      className={`!w-full !bg-danger !p-5 h-10 md:w-auto md:h-12 aspect-square md:aspect-auto text-secondary hover:!bg-danger/90 shadow-none ${className}`}
    >
      <span className="hidden md:inline">{t("logout")}</span>
    </Button>
  );
};
