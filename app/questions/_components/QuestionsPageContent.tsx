"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { NextClient } from "@/tools/NextClient";
import { GetQuestionsDto } from "@/model/question/dto/GetQuestionsDto";
import { Icon } from "../../components/Icon";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { Spinner } from "../../components/Spinner";
import { QuestionCard } from "./QuestionCard";
import { Empty } from "../../components/Empty";
import { Pagination } from "../../components/Pagination";
import { QuestionCreateModal } from "./QuestionCreateModal";
import { GetQuestionsResponseDto } from "@/model/question/dto/GetQuestionsResponseDto";
import { useSession } from "next-auth/react";

type Props = {
  limit: number;
};

export function QuestionsPageContent({ limit }: Props) {
  const [createQuestionModalVisible, setCreateQuestionModalVisible] =
    useState(false);
  const [page, setPage] = useState(1);
  const [isPublic, setIsPublic] = useState<boolean | undefined>(undefined);
  const [sort, setSort] = useState<GenericSortType>(GenericSortType.NEWEST);

  const { data } = useSession();
  const queryClient = useQueryClient();

  const {
    data: questions,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "questions",
      "user",
      {
        page,
        limit,
        isPublic,
        sort,
      },
    ],
    queryFn: async () => {
      const { data } = await NextClient<GetQuestionsResponseDto>("/questions", {
        method: "GET",
        params: {
          page,
          limit,
          isPublic,
          sort,
        } as GetQuestionsDto,
      });

      return data;
    },
    enabled: Boolean(data?.user?._id),
    placeholderData: keepPreviousData,
  });

  const handlePublicFilterChange = async (value?: boolean) => {
    setIsPublic(value);
    await queryClient.invalidateQueries({
      queryKey: ["questions", "user", page, limit, isPublic, sort],
    });
  };

  const handleSortChange = async (value: GenericSortType) => {
    setSort(value);
    await queryClient.invalidateQueries({
      queryKey: ["questions", "user", page, limit, isPublic, sort],
    });
  };

  return (
    <div className="w-full min-h-screen bg-surface-muted p-4 pt-6 md:p-8 lg:p-12">
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

              <Button
                onClick={() => setCreateQuestionModalVisible(true)}
                className="w-full !h-14 !rounded-2xl !bg-accent !text-secondary font-black shadow-lg shadow-accent/20"
                icon={faPlus}
              >
                طرح سؤال جديد
              </Button>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[2.5rem] p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-text-primary px-2">نتائج الأسئلة</h3>

            <Select
              items={[
                {
                  label: "كل الأنواع",
                  value: undefined,
                },
                {
                  label: "خاص",
                  value: false,
                },
                {
                  label: "عام",
                  value: true,
                },
              ]}
              value={isPublic}
              onChange={handlePublicFilterChange}
              placeholder="اختر النوع"
            />

            <Select
              items={[
                {
                  label: "الأحدث أولاً",
                  value: GenericSortType.NEWEST,
                },
                {
                  label: "الأقدم أولاً",
                  value: GenericSortType.OLDEST,
                },
              ]}
              value={sort}
              onChange={handleSortChange}
              placeholder="اختر الترتيب"
            />
          </div>
        </aside>

        <main className="lg:col-span-8">
          <div className="bg-surface border border-border rounded-[3rem] shadow-sm min-h-[600px] flex flex-col">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                قائمة الأسئلة
              </h2>
            </div>

            <div className="flex-1 p-6 md:p-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Spinner className="text-accent static" />
                </div>
              ) : questions?.data?.length ? (
                <div
                  className={`space-y-6 group/list transition-opacity ${
                    isFetching ? "opacity-60" : ""
                  }`}
                >
                  {questions.data.map((question) => (
                    <QuestionCard
                      key={question._id}
                      question={question}
                      setPage={setPage}
                    />
                  ))}
                </div>
              ) : (
                <Empty
                  title="لا توجد نتائج"
                  description="جرب تغيير فلاتر البحث أو ابدأ بإضافة سؤال جديد."
                  action={{
                    title: "أضف سؤالك الأول",
                    onClick: () => setCreateQuestionModalVisible(true),
                  }}
                />
              )}

              {questions?.meta ? (
                <Pagination meta={questions.meta} onPageChange={setPage} />
              ) : null}
            </div>
          </div>
        </main>
      </div>

      <QuestionCreateModal
        open={createQuestionModalVisible}
        onClose={() => setCreateQuestionModalVisible(false)}
      />
    </div>
  );
}
