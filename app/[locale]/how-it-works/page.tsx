import { Icon } from "@/app/components/Icon";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons/faUserCircle";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";
import { Link } from "@/i18n/navigation";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { getTranslations } from "next-intl/server";
import { _Translator } from "next-intl";

const getSteps = (t: _Translator) => [
  {
    icon: faUserCircle,
    title: t("howItWorks.steps.0.title"),
    description: t("howItWorks.steps.0.description"),
  },
  {
    icon: faLink,
    title: t("howItWorks.steps.1.title"),
    description: t("howItWorks.steps.1.description"),
  },
  {
    icon: faUserSecret,
    title: t("howItWorks.steps.2.title"),
    description: t("howItWorks.steps.2.description"),
  },
  {
    icon: faComments,
    title: t("howItWorks.steps.3.title"),
    description: t("howItWorks.steps.3.description"),
  },
  {
    icon: faPaperPlane,
    title: t("howItWorks.steps.4.title"),
    description: t("howItWorks.steps.4.description"),
  },
];

export default async function Page() {
  const t = await getTranslations();

  const steps = getSteps(t);

  return (
    <main className="w-full bg-surface">
      <section className="pt-20 pb-16 px-6 text-center border-b border-border/50 bg-surface-muted/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-black text-primary tracking-tight">
            {t.rich("howItWorks.title", {
              span: (chunk) => <span className="text-accent">{chunk}</span>,
            })}
          </h1>
          <p className="text-lg text-text-muted font-medium leading-relaxed max-w-2xl mx-auto">
            {t("howItWorks.subtitle")}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className="bg-background border border-border p-6 md:p-8 rounded-[2rem] flex items-start gap-5 transition-all"
              >
                <div className="w-12 h-12 shrink-0 bg-accent/10 text-accent rounded-2xl flex items-center justify-center text-lg font-bold">
                  <Icon icon={step.icon} />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-black text-primary">
                      {step.title}
                    </h3>
                    <span className="text-xs font-black text-accent bg-accent/10 px-3 py-1 rounded-full select-none">
                      0{i + 1}
                    </span>
                  </div>
                  <p className="text-text-muted leading-relaxed text-sm md:text-base font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-22">
            <div className="bg-primary rounded-[2rem] p-8 text-secondary space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-xl">
                  <Icon icon={faLightbulb} />
                </div>
                <h4 className="text-xl font-black">
                  {t("howItWorks.tip.title")}
                </h4>
              </div>
              <p className="text-secondary/80 leading-relaxed font-medium text-sm md:text-base">
                {t("howItWorks.tip.description")}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto px-6 py-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4 mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                {t("home.cta.title")}
              </h2>
              <p className="text-text-muted font-medium leading-relaxed">
                {t("home.cta.description")}
              </p>
            </div>

            <div className="flex justify-center">
              <Link
                href="/signup"
                className="h-16 px-10 bg-accent text-secondary rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-accent/90 transition-all"
              >
                {t("home.cta.button")}
                <Icon icon={faBolt} className="ltr:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
