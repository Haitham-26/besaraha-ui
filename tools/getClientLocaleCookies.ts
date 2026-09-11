import { AppLangs } from "@/model/shared/types/AppLangs.enum";

export const getClientLocaleCookies = () => {
  const localeCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("locale="));

  if (localeCookie) {
    const localeCookieValue = localeCookie.split("=").slice(1).join("=");

    const isValid = Object.values(AppLangs).includes(
      localeCookieValue as AppLangs,
    );

    if (isValid) {
      return localeCookieValue as AppLangs;
    }

    return AppLangs.EN;
  }

  return AppLangs.EN;
};
