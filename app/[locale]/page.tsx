import { Icon } from "@/app/components/Icon";
import { faMessage } from "@fortawesome/free-solid-svg-icons/faMessage";
import { faAt } from "@fortawesome/free-solid-svg-icons/faAt";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons/faQuoteRight";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";

export default async function Page() {
  const t = await getTranslations();

  return (
    <main className="w-full bg-background text-text-primary selection:bg-accent/20">
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-4xl font-black tracking-tighter text-primary mb-4">
              {t.rich("home.hero.title", {
                primary: (chunk) => (
                  <span className="text-accent tracking-wide">{chunk}</span>
                ),
                accent: (chunk) => (
                  <span className="text-primary tracking-wide">{chunk}</span>
                ),
              })}
            </h1>
            <h2 className="text-2xl font-black tracking-tighter leading-8 text-primary mb-4">
              {t("app.description")}
            </h2>
            <p className="text-xl text-text-muted max-w-xl leading-9 font-medium">
              {t.rich("home.hero.description")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/signup"
                className="h-16 px-10 bg-accent text-secondary rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-accent/90 transition-all shadow-xl shadow-primary/20"
              >
                {t("home.hero.actions.main")}
                <Icon icon={faBolt} className="ltr:rotate-180" />
              </Link>
              <Link
                href="/how-it-works"
                className="h-16 px-10 bg-surface border border-border text-primary rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-surface-muted transition-all"
              >
                <Icon icon={faCircleQuestion} className="text-accent" />
                {t("home.hero.actions.secondary")}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="space-y-4 transform lg:rotate-3">
              <div className="bg-surface border border-border p-6 rounded-[2rem] shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon icon={faQuoteRight} />
                  </div>
                  <span className="text-xs font-black">
                    {t("home.hero.cards.0.header")}
                  </span>
                </div>
                <p className="font-bold text-primary italic">
                  {t("home.hero.cards.0.body")}
                </p>
              </div>
              <div className="bg-primary p-6 rounded-[2rem] text-secondary shadow-xl translate-x-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                    <Icon icon={faReply} />
                  </div>
                  <span className="text-xs font-black">
                    {t("home.hero.cards.1.header")}
                  </span>
                </div>
                <p className="font-bold">{t("home.hero.cards.1.body")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-muted/50 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface border border-border p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center">
                <Icon icon={faMessage} className="text-2xl" />
              </div>
              <h3 className="text-3xl font-black text-primary">
                {t("home.sections.0.cards.0.title")}
              </h3>
              <p className="text-text-muted font-medium leading-relaxed">
                {t("home.sections.0.cards.0.description")}
              </p>
            </div>
            <div className="bg-surface border border-border p-10 rounded-[3rem] space-y-6">
              <div className="w-14 h-14 bg-primary text-secondary rounded-2xl flex items-center justify-center">
                <Icon icon={faAt} className="text-2xl" />
              </div>
              <h3 className="text-3xl font-black text-primary">
                {t("home.sections.0.cards.1.title")}
              </h3>
              <p className="text-text-muted font-medium leading-relaxed">
                {t("home.sections.0.cards.1.description")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
