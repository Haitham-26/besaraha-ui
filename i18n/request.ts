import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export default getRequestConfig(async ({ requestLocale }) => {
  const urlLocale = await requestLocale;

  console.log(urlLocale);

  if (urlLocale && routing.locales.includes(urlLocale as AppLangs)) {
    return {
      locale: urlLocale,
      messages: (await import(`../messages/${urlLocale}.json`)).default,
    };
  }

  const cookieLocale = (await cookies()).get("locale")?.value;

  if (cookieLocale && routing.locales.includes(cookieLocale as AppLangs)) {
    return {
      locale: cookieLocale,
      messages: (await import(`../messages/${cookieLocale}.json`)).default,
    };
  }

  return {
    locale: routing.defaultLocale,
    messages: (await import(`../messages/${routing.defaultLocale}.json`))
      .default,
  };
});
