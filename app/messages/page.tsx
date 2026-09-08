import { getServerSession } from "next-auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { getQueryClient } from "../get-query-client";
import { MessagesPageContent } from "./_components/MessagesPageContent";
import { authOptions } from "@/lib/auth";
import { AuthClient } from "@/tools/AuthClient";
import getToken from "@/tools/getToken";

const MESSAGES_LIMIT = 2;

type Props = {
  searchParams: Promise<{
    page?: string;
    isStarred?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams: _searchParams }: Props) {
  const [session, token, searchParams] = await Promise.all([
    getServerSession(authOptions),
    getToken(),
    _searchParams,
  ]);

  const queryClient = getQueryClient();

  const page = Number(searchParams.page);

  const normalizedParams = {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: MESSAGES_LIMIT,

    ...(searchParams.isStarred &&
    ["true", "false"].includes(searchParams.isStarred)
      ? {
          isStarred: searchParams.isStarred === "true",
        }
      : {}),

    sort: Object.values(GenericSortType).includes(
      searchParams.sort as GenericSortType,
    )
      ? (searchParams.sort as GenericSortType)
      : GenericSortType.NEWEST,
  };

  const currentSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      currentSearchParams.set(key, value);
    }
  }

  if (session?.user?._id) {
    await queryClient.prefetchQuery({
      queryKey: ["messages", normalizedParams],
      queryFn: async () => {
        const { data } = await AuthClient(
          "/messages",
          {
            method: "GET",
            params: normalizedParams,
          },
          token,
        );
        return data;
      },
      staleTime: 0,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MessagesPageContent
        searchParams={currentSearchParams}
        normalizedParams={normalizedParams}
      />
    </HydrationBoundary>
  );
}
