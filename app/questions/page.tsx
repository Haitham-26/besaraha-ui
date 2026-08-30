import { getServerSession } from "next-auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";
import { getQueryClient } from "../get-query-client";
import { NextClient } from "@/tools/NextClient";
import { QuestionsPageContent } from "./_components/QuestionsPageContent";
import { authOptions } from "../api/auth/[...nextauth]/route";

const QUESTIONS_LIMIT = 10;

export default async function Page() {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const defaultParams = {
    page: 1,
    limit: QUESTIONS_LIMIT,
    isPublic: undefined,
    sort: GenericSortType.NEWEST,
  };

  if (session?.user?._id) {
    await queryClient.prefetchQuery({
      queryKey: ["questions", "user", defaultParams],
      queryFn: async () => {
        const { data } = await NextClient<GetQuestionsResponseDto>(
          "/questions",
          {
            method: "GET",
            params: defaultParams,
          },
        );
        return data;
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <QuestionsPageContent limit={QUESTIONS_LIMIT} />
    </HydrationBoundary>
  );
}
