import { Fragment } from "react";
import QuestionCard from "../../_components/QuestionCard";
import { useQuery } from "@tanstack/react-query";
import { NextClient } from "@/tools/NextClient";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { Question } from "@/model/question/Question";
import { Pagination } from "@/app/components/Pagination";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/app/components/Spinner";

type PublicQuestionsPageContentProps = {
  normalizedParams: {
    page: number;
    limit: number;
  };
};

export default function PublicQuestionsPageContent({
  normalizedParams,
}: PublicQuestionsPageContentProps) {
  const searchParams = useSearchParams();

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", "public", normalizedParams],
    queryFn: async () => {
      const { data } = await NextClient<DataWithMeta<Question>>(
        "/questions/public",
        {
          method: "GET",
          params: normalizedParams,
        },
      );
      return data;
    },
  });

  return (
    <Fragment>
      <div className="flex flex-col gap-6 mb-12">
        {isLoading ? <Spinner /> : null}

        {questions?.data?.length && !isLoading
          ? questions.data.map((question) => (
              <QuestionCard
                key={question._id}
                question={question}
                pathname="/questions/public"
                normalizedParams={normalizedParams}
              />
            ))
          : null}
      </div>

      {!questions?.data.length && !isLoading ? (
        <div className="text-center py-20 bg-surface border border-dashed border-border rounded-3xl text-slate-400">
          لا توجد أسئلة عامة حالياً
        </div>
      ) : null}

      <Pagination
        meta={questions?.meta}
        pathname={"/questions/public"}
        searchParams={searchParams}
      />
    </Fragment>
  );
}
