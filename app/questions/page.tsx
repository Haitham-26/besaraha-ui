import { getServerSession } from "next-auth";

import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";

import { QuestionsPageContent } from "./_components/QuestionsPageContent";
import { AuthClient } from "@/tools/AuthClient";
import getToken from "@/tools/getToken";
import { authOptions } from "@/lib/auth";
import { getQueryClient } from "@/app/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const QUESTIONS_LIMIT = 2;

type Props = {
  searchParams: Promise<{
    page?: string;
    isPublic?: string;
    sort?: string;
  }>;
};

export default async function Page({ searchParams: _searchParams }: Props) {
  const [session, searchParams, token] = await Promise.all([
    getServerSession(authOptions),
    _searchParams,
    getToken(),
  ]);

  const page = Number(searchParams.page);

  const normalizedParams = {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: QUESTIONS_LIMIT,

    ...(searchParams.isPublic &&
    ["true", "false"].includes(searchParams.isPublic)
      ? {
          isPublic: searchParams.isPublic === "true",
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

  const queryClient = getQueryClient();

  if (session?.user?._id) {
    await queryClient.prefetchQuery({
      queryKey: ["questions", "user", normalizedParams],

      queryFn: async () => {
        const { data } = await AuthClient<GetQuestionsResponseDto>(
          "/questions",
          {
            method: "GET",
            params: normalizedParams,
          },
          token,
        );

        return data;
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionsPageContent
        searchParams={currentSearchParams}
        normalizedParams={normalizedParams}
      />
    </HydrationBoundary>
  );
}
