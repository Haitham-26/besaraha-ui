"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { formattedDate } from "@/tools/Date";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons/faShareNodes";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons/faFingerprint";
import { faAt } from "@fortawesome/free-solid-svg-icons/faAt";
import { Icon } from "../../components/Icon";
import { CopyButton } from "../../components/CopyButton";
import { ProfileUpdateModal } from "./ProfileUpdateModal";
import { NextClient } from "@/tools/NextClient";
import { User } from "@/model/user/types/User";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { Button } from "@/app/components/Button";
import { faEdit } from "@fortawesome/free-solid-svg-icons/faEdit";
import React, { useState } from "react";
import { _Translator, useLocale, useTranslations } from "next-intl";

const getInfoData = (t: _Translator, user: User) => [
  {
    key: "name",
    label: t("info.fields.name"),
    icon: faUserCircle,
    value: user.name,
  },
  {
    key: "username",
    label: t("info.fields.username"),
    icon: faAt,
    value: `@${user.username}`,
  },
  {
    key: "email",
    label: t("info.fields.email"),
    icon: faEnvelope,
    value: user.email,
  },
  {
    key: "createdAt",
    label: t("info.fields.createdAt"),
    icon: faCalendarAlt,
    value: formattedDate(user.createdAt),
  },
];

export const ProfileContent: React.FC = () => {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const t = useTranslations("profile");
  const locale = useLocale();
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await NextClient<User>("/user", { method: "GET" });
      return data;
    },
  });

  const user = data || ({} as User);

  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${locale !== AppLangs.EN ? `/${locale}` : ""}/${user.username || user._id}/message`;

  const infoData = getInfoData(t, user);

  return (
    <main className="w-full bg-background pt-10 pb-7 lg:pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 px-6">
        <aside className="relative p-8 bg-primary rounded-4xl md:col-span-4 space-y-6 h-fit md:sticky md:top-26">
          <div className="relative z-10 flex flex-col items-center gap-4 m-0">
            <div className="w-32 h-32 bg-surface rounded-full flex items-center justify-center border-2 border-surface-muted/5 overflow-hidden">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={128}
                  height={128}
                  quality={100}
                  className="w-full h-full"
                />
              ) : (
                <Icon
                  icon={faUserCircle}
                  className="text-accent !w-full !h-full"
                />
              )}
            </div>

            <div className="text-center space-y-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-accent font-mono text-مل [dir:ltr]">
                  @{user.username}
                </p>
              </div>

              <Button
                onClick={() => setEditModalVisible(true)}
                icon={faEdit}
                className="mt-6 w-full"
              >
                {t("side.button")}
              </Button>

              <ProfileUpdateModal
                open={editModalVisible}
                onClose={() => setEditModalVisible(false)}
              />
            </div>
          </div>
        </aside>

        <div className="md:col-span-8 space-y-4">
          <div className="bg-surface rounded-4xl border-2 border-border p-8 md:p-10 shadow-sm relative group overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <Icon icon={faShareNodes} className="text-xl" />
                </div>
                <h2 className="text-lg font-black text-text-primary">
                  {t("link.title")}
                </h2>
              </div>

              <p className="mb-4 text-text-muted">{t("link.description")}</p>

              <div className="flex flex-col md:flex-row rtl:md:flex-row-reverse p-2 bg-surface-muted rounded-2xl border-2 border-border/50">
                <div className="grow px-6 py-4 font-mono text-text-primary [direction:ltr] max-w-full text-start truncate ps-0">
                  {profileUrl}
                </div>

                <CopyButton text={profileUrl} />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-4xl border-2 border-border p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                <Icon icon={faFingerprint} className="text-xl" />
              </div>
              <h2 className="text-lg font-black text-text-primary">
                {t("info.title")}
              </h2>
            </div>

            <div className="grid gap-6">
              {infoData.map(({ key, icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-surface-muted/50 rounded-2xl border border-transparent hover:border-border transition-all"
                >
                  <div className="flex items-center gap-4 mb-2 md:mb-0">
                    <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-text-muted border border-border">
                      <Icon icon={icon} />
                    </div>
                    <span className="text-text-muted font-bold">{label}</span>
                  </div>
                  <span
                    className={`font-black text-lg ${
                      key === "username"
                        ? "text-accent dir-ltr"
                        : "text-text-primary"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
