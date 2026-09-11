import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export default getRequestConfig(async ({ requestLocale }) => {
  const urlLocale = await requestLocale;

  console.log("url locale ----------------", urlLocale);

  if (urlLocale && routing.locales.includes(urlLocale as AppLangs)) {
    return {
      locale: urlLocale,
      messages: (await import(`../messages/${urlLocale}.json`)).default,
    };
  }

  const cookieStore = await cookies();
  const locale =
    cookieStore.get("locale")?.value === AppLangs.EN
      ? AppLangs.EN
      : AppLangs.AR;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
