import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { redirect } from "@/i18n/navigation";
import { AuthClient } from "@/tools/AuthClient";
import getToken from "@/tools/getToken";
import { User } from "@/model/user/types/User";
import { getQueryClient } from "@/app/get-query-client";
import { ProfileContent } from "./_components/ProfileContent";

export default async function Page() {
  const [token, cookieStore] = await Promise.all([getToken(), cookies()]);
  const locale = (cookieStore.get("locale")?.value as AppLangs) || AppLangs.EN;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await AuthClient<User>(
        "/user",
        { method: "GET" },
        token,
      );
      return data;
    },
  });

  const user = queryClient.getQueryData<User>(["user"]);

  if (!user) {
    redirect({ href: "/login", locale });
    return;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileContent locale={locale} />
    </HydrationBoundary>
  );
}
