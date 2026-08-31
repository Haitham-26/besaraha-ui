import { AuthClient } from "@/tools/AuthClient";
import QuestionCard from "../_components/QuestionCard";
import { Question } from "@/model/question/Question";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { Pagination } from "@/app/components/Pagination";
import getToken from "@/tools/getToken";

const QUESTIONS_LIMIT = 10;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [_searchParams, token] = await Promise.all([searchParams, getToken()]);

  const currentSearchParams = new URLSearchParams(_searchParams);

  const page = Number(currentSearchParams.get("page") || 1) || 1;

  const { data: questions } = await AuthClient<DataWithMeta<Question>>(
    "/questions/public",
    {
      method: "GET",
      params: { page, limit: QUESTIONS_LIMIT },
    },
    token,
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
            <QuestionCard
              key={question._id}
              question={question}
              pathname="/questions/public"
            />
          ))
        ) : (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-3xl text-slate-400">
            لا توجد أسئلة عامة حالياً
          </div>
        )}
      </div>

      <Pagination
        meta={questions?.meta}
        pathname={"/questions/public"}
        searchParams={currentSearchParams}
      />
    </div>
  );
}
