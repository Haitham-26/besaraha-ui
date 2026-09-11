import { defineRouting } from "next-intl/routing";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export const routing = defineRouting({
  locales: [AppLangs.EN, AppLangs.AR],
  defaultLocale: AppLangs.EN,
  localePrefix: "as-needed",
  localeCookie: false,
  localeDetection: false,
});
