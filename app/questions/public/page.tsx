import { AuthClient } from "@/tools/AuthClient";
import { QuestionCard } from "../_components/QuestionCard";
import { PublicQuestionsPagination } from "./_components/PublicQuestionsPagination";
import { Question } from "@/model/question/Question";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";

const QUESTIONS_LIMIT = 10;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  const { data: questions } = await AuthClient<DataWithMeta<Question>>(
    "/questions/public",
    {
      method: "GET",
      params: { page, limit: QUESTIONS_LIMIT },
    },
  );

  return (
    <div className="max-w-6xl md:min-w-3xl mx-auto p-4 md:p-8 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">
          أسئلة المنتدى
        </h1>

        <p className="text-slate-500 mt-2">
          استكشف آخر الأسئلة من مجتمع
          <span className="text-accent font-bold"> بصراحة</span>
        </p>

        <p className="text-slate-500 mt-4 text-xs">
          انقر على السؤال لمشاهدة الردود الخاصة به.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-12">
        {questions?.data?.length ? (
          questions.data.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-3xl text-slate-400">
            لا توجد أسئلة عامة حالياً
          </div>
        )}
      </div>

      <PublicQuestionsPagination meta={questions?.meta} />
    </div>
  );
}
