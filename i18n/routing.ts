import { defineRouting } from "next-intl/routing";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export const routing = defineRouting({
  locales: [AppLangs.AR, AppLangs.EN],
  defaultLocale: AppLangs.EN,
  localePrefix: "as-needed",
});
