import { AuthClient } from "@/tools/AuthClient";
import { getQueryClient } from "@/app/get-query-client";
import PublicQuestionsPageContent from "./_components/PublicQuestionsPageContent";

const QUESTIONS_LIMIT = 10;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const _searchParams = await searchParams;
  const queryClient = getQueryClient();

  const currentSearchParams = new URLSearchParams(_searchParams);

  const page = Number(currentSearchParams.get("page") || 1) || 1;

  const normalizedParams = {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: QUESTIONS_LIMIT,
  };

  await queryClient.prefetchQuery({
    queryKey: ["questions", "public", normalizedParams],
    queryFn: async () => {
      const { data } = await AuthClient("/questions/public", {
        method: "GET",
        params: normalizedParams,
      });
      return data;
    },
  });

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

      <PublicQuestionsPageContent normalizedParams={normalizedParams} />
    </div>
  );
}
