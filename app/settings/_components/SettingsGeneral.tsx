"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/Button";
import { Toast } from "@/tools/Toast";
import { NextClient } from "@/tools/NextClient";
import { Settings } from "@/model/settings/types/Settings";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { useTranslations } from "next-intl";

const languages = [
  { value: AppLangs.AR, label: "العربية" },
  { value: AppLangs.EN, label: "English" },
];

export default function SettingsGeneral() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations();

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await NextClient<Settings>("/settings");
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (lang: AppLangs) => {
      await NextClient("/settings/update", {
        method: "PATCH",
        data: { lang },
      });
    },
    onSuccess: async (_, lang) => {
      console.log("lang", lang);

      document.cookie = `locale=${lang}; path=/; max-age=31536000; SameSite=Lax`;

      await queryClient.invalidateQueries({ queryKey: ["settings"] });

      router.refresh();

      Toast.success(t("settings.general.success", { language: lang }));
    },
    onError: (e) => {
      Toast.apiError(e);
    },
  });

  const activeLanguage = mutation.isPending
    ? mutation.variables
    : settings?.lang;

  const handleSelect = (newLang: AppLangs) => {
    if (newLang === activeLanguage || mutation.isPending) {
      return;
    }
    mutation.mutate(newLang);
  };

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-slate-900">
          {t("settings.general.language.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {t("settings.general.language.description")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {languages.map((option) => {
          const active = option.value === activeLanguage;

          return (
            <Button
              key={option.value}
              disabled={mutation.isPending}
              onClick={() => handleSelect(option.value)}
              className={`!bg-transparent shadow-none rounded-xl border font-bold ${
                active
                  ? "!border-accent !bg-accent/5 !text-accent"
                  : "!border-slate-200 !text-slate-600 hover:!border-slate-300 hover:!bg-slate-50"
              } [&>div]:justify-between [&>div]:w-full`}
            >
              <span>{option.label}</span>
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                  active ? "border-accent bg-accent" : "border-slate-300"
                }`}
              />
            </Button>
          );
        })}
      </div>

      {mutation.isPending ? (
        <p className="text-sm text-slate-400">{t("common.saving")}</p>
      ) : null}
    </section>
  );
}
