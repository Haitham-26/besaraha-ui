import { AuthClient } from "@/tools/AuthClient";
import { getQueryClient } from "@/app/get-query-client";
import PublicQuestionsPageContent from "./_components/PublicQuestionsPageContent";
import { getTranslations } from "next-intl/server";
import { Link as LocaleLink } from "@/i18n/navigation";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const QUESTIONS_LIMIT = 5;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [_searchParams, t, session] = await Promise.all([
    searchParams,
    getTranslations("forum"),
    getServerSession(authOptions),
  ]);

  const queryClient = getQueryClient();

  const isLoggedIn = Boolean(session?.user?._id.length);

  const LinkToUse = isLoggedIn ? Link : LocaleLink;

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
    <main className="w-full bg-background">
      <section className="pt-24 pb-10 px-6 text-center border-b border-border/50 bg-surface-muted/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
            {t.rich("title", {
              accent: (chunks) => <span className="text-accent">{chunks}</span>,
            })}
          </h1>
          <p className="text-lg text-text-muted font-medium leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-22">
            <div className="bg-primary rounded-[2rem] p-8 text-secondary space-y-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent flex items-center justify-center text-xl mb-4">
                  <Icon icon={faComments} />
                </div>
                <h3 className="text-2xl font-black">
                  {t("sidebar.askCard.title")}
                </h3>
                <p className="text-secondary/80 font-medium text-sm leading-relaxed">
                  {t("sidebar.askCard.description")}
                </p>
              </div>

              <LinkToUse
                href={isLoggedIn ? "/questions" : "/login"}
                className="w-full h-12 bg-accent text-secondary rounded-xl font-black flex items-center justify-center gap-2 hover:bg-accent/90 transition-all"
              >
                <Icon icon={faPlus} />
                {t("sidebar.askCard.button")}
              </LinkToUse>
            </div>

            <div className="bg-surface border border-border rounded-[2rem] p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg">
                  <Icon icon={faUsers} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-primary text-base">
                    {t("sidebar.info.communityTitle")}
                  </h4>
                  <p className="text-text-muted text-sm font-medium leading-relaxed">
                    {t("sidebar.info.communityDesc")}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-lg">
                  <Icon icon={faShieldHalved} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-black text-primary text-base">
                    {t("sidebar.info.privacyTitle")}
                  </h4>
                  <p className="text-text-muted text-sm font-medium leading-relaxed">
                    {t("sidebar.info.privacyDesc")}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <h2 className="text-2xl font-black text-primary mb-6">
              {t.rich("questions.title", {
                span: (chunk) => <span className="text-accent">{chunk}</span>,
              })}
            </h2>
            <PublicQuestionsPageContent normalizedParams={normalizedParams} />
          </div>
        </div>
      </section>
    </main>
  );
}
