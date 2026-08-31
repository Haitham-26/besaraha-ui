import { getServerSession } from "next-auth";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";
import { getQueryClient } from "../get-query-client";
import { NextClient } from "@/tools/NextClient";
import { MessagesPageContent } from "./_components/MessagesPageContent";
import { authOptions } from "@/lib/auth";

const MESSAGES_LIMIT = 10;

export default async function Page() {
  const session = await getServerSession(authOptions);
  const queryClient = getQueryClient();

  const defaultParams = {
    page: 1,
    limit: MESSAGES_LIMIT,
    isStarred: undefined,
    sort: GenericSortType.NEWEST,
  };

  if (session?.user?._id) {
    await queryClient.prefetchQuery({
      queryKey: ["messages", defaultParams],
      queryFn: async () => {
        const { data } = await NextClient<GetQuestionsResponseDto>(
          "/messages",
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
      <MessagesPageContent limit={MESSAGES_LIMIT} />
    </HydrationBoundary>
  );
}
