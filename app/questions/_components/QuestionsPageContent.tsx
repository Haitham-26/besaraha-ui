"use client";

import { Icon } from "../../components/Icon";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";

import QuestionCard from "./QuestionCard";
import { Empty } from "../../components/Empty";
import { Pagination } from "../../components/Pagination";
import { QuestionCreateModal } from "./QuestionCreateModal";
import { QuestionsFilters } from "./QuestionsFilters";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/app/components/Spinner";
import { NextClient } from "@/tools/NextClient";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/app/components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

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
  const [createQuestionModalVisible, setCreateQuestionModalVisible] =
    useState(false);

  const t = useTranslations("questions");

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
    <main className="w-full bg-background pt-10 pb-7 lg:pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 px-6">
        <aside className="md:col-span-4 space-y-6">
          <div className="bg-primary rounded-[2.5rem] p-8 text-secondary shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-secondary/10 backdrop-blur-md rounded-2xl mb-6">
                <Icon icon={faComments} className="text-accent text-2xl" />
              </div>

              <h1 className="text-4xl font-black mb-4 leading-tight">
                {t("side.title")}
              </h1>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-6xl font-black text-accent">
                  {questions?.meta?.total || 0}
                </span>

                <span className="text-secondary/40 text-sm font-bold tracking-widest uppercase">
                  {t("side.totalTitle")}
                </span>
              </div>

              <Button
                onClick={() => setCreateQuestionModalVisible(true)}
                className="w-full !h-14 !rounded-2xl !bg-accent !text-secondary font-black shadow-lg shadow-accent/20"
                icon={faPlus}
              >
                {t("side.button")}
              </Button>
            </div>
          </div>

          <QuestionsFilters />
        </aside>

        <div className="md:col-span-8">
          <div className="bg-surface border border-border rounded-4xl shadow-sm min-h-[16rem] flex flex-col">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {t("menu.title")}
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
                  title={t("menu.empty.title")}
                  description={t("menu.empty.description")}
                  action={{
                    title: t("menu.empty.action"),
                    onClick: () => setCreateQuestionModalVisible(true),
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <QuestionCreateModal
        open={createQuestionModalVisible}
        onClose={() => setCreateQuestionModalVisible(false)}
      />
    </main>
  );
}
