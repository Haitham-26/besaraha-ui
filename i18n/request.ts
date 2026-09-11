import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export default getRequestConfig(async () => {
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
