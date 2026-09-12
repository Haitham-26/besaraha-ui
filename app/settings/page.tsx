import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import SettingsGeneral from "./_components/SettingsGeneral";
import { getQueryClient } from "../get-query-client";
import { AuthClient } from "@/tools/AuthClient";
import getToken from "@/tools/getToken";

export default async function Page() {
  const token = await getToken();

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await AuthClient(
        "/settings",
        {
          method: "GET",
        },
        token,
      );
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsGeneral />
    </HydrationBoundary>
  );
}
