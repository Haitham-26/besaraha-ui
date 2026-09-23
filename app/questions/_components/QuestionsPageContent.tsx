"use client";

import { Icon } from "../../components/Icon";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";

import QuestionCard from "./QuestionCard";
import { Empty } from "../../components/Empty";
import { Pagination } from "../../components/Pagination";
import { QuestionCreateModalAndButton } from "./QuestionCreateModalAndButton";
import { QuestionsFilters } from "./QuestionsFilters";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/app/components/Spinner";
import { NextClient } from "@/tools/NextClient";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { Fragment } from "react";

const PATHNAME = "/questions";

type QuestionsPageContentProps = {
  searchParams: URLSearchParams;
  normalizedParams: {
    sort: GenericSortType;
    isPublic?: boolean;
    page: number;
    limit: number;
  };
};

export function QuestionsPageContent({
  searchParams,
  normalizedParams,
}: QuestionsPageContentProps) {
  const { data: questions, isLoading } = useQuery<GetQuestionsResponseDto>({
    queryKey: ["questions", "user", normalizedParams],
    queryFn: async () => {
      const { data } = await NextClient<GetQuestionsResponseDto>("/questions", {
        method: "GET",
        params: normalizedParams,
      });

      return data;
    },
  });

  return (
    <main className="w-full bg-surface-muted p-4 pt-6 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-primary rounded-[2.5rem] p-8 text-secondary shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-accent rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-secondary/10 backdrop-blur-md rounded-2xl mb-6">
                <Icon icon={faComments} className="text-accent text-2xl" />
              </div>

              <h1 className="text-4xl font-black mb-4 leading-tight">
                مركز الأسئلة
              </h1>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black text-accent">
                  {questions?.meta?.total || 0}
                </span>

                <span className="text-secondary/40 text-sm font-bold tracking-widest uppercase">
                  سؤال نشط
                </span>
              </div>

              <QuestionCreateModalAndButton />
            </div>
          </div>

          <QuestionsFilters />
        </aside>

        <div className="lg:col-span-8">
          <div className="bg-surface border border-border rounded-[3rem] shadow-sm min-h-[600px] flex flex-col">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                قائمة الأسئلة
              </h2>
            </div>

            <div className="flex-1 p-6 md:p-8">
              {isLoading ? <Spinner /> : null}

              {questions?.data?.length && !isLoading ? (
                <Fragment>
                  <div className="space-y-6">
                    {questions.data.map((question) => (
                      <QuestionCard
                        key={question._id}
                        question={question}
                        pathname={PATHNAME}
                        normalizedParams={normalizedParams}
                      />
                    ))}
                  </div>

                  <Pagination
                    meta={questions?.meta}
                    pathname={PATHNAME}
                    searchParams={searchParams}
                    shouldUseLocalePrefix
                  />
                </Fragment>
              ) : null}

              {!questions?.data?.length && !isLoading ? (
                <Empty
                  title="لا توجد نتائج"
                  description="جرب تغيير فلاتر البحث أو ابدأ بإضافة سؤال جديد."
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
