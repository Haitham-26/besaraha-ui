import { Icon } from "@/app/components/Icon";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons/faQuoteRight";
import { faReply } from "@fortawesome/free-solid-svg-icons/faReply";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { faBolt } from "@fortawesome/free-solid-svg-icons/faBolt";
import { _Translator } from "next-intl";
import { faLink } from "@fortawesome/free-solid-svg-icons/faLink";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";

import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { Collapse } from "../components/Collapse";
import Image from "next/image";

const getFeatures = (t: _Translator) => [
  {
    icon: faLink,
    title: t("home.features.items.link.title"),
    description: t("home.features.items.link.description"),
  },
  {
    icon: faComments,
    title: t("home.features.items.forum.title"),
    description: t("home.features.items.forum.description"),
  },
  {
    icon: faUserSecret,
    title: t("home.features.items.privacy.title"),
    description: t("home.features.items.privacy.description"),
  },
];

const getHowItWorksSteps = (t: _Translator) => [
  {
    icon: faUserPlus,
    title: t("home.howItWorks.steps.0.title"),
    description: t("home.howItWorks.steps.0.description"),
  },
  {
    icon: faLink,
    title: t("home.howItWorks.steps.1.title"),
    description: t("home.howItWorks.steps.1.description"),
  },
  {
    icon: faComments,
    title: t("home.howItWorks.steps.2.title"),
    description: t("home.howItWorks.steps.2.description"),
  },
];

const getFaqItems = (t: _Translator) => [
  {
    title: t("home.faq.items.0.q"),
    description: t("home.faq.items.0.a"),
  },
  {
    title: t("home.faq.items.1.q"),
    description: t("home.faq.items.1.a"),
  },
  {
    title: t("home.faq.items.2.q"),
    description: t("home.faq.items.2.a"),
  },
  {
    title: t("home.faq.items.3.q"),
    description: t("home.faq.items.3.a"),
  },
  {
    title: t("home.faq.items.4.q"),
    description: t("home.faq.items.4.a"),
  },
];

export default async function Page() {
  const t = await getTranslations();

  const features = getFeatures(t);
  const howItWorksSteps = getHowItWorksSteps(t);
  const faqItems = getFaqItems(t);

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

      <section className="py-12 bg-surface-muted/50 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-3xl font-black text-primary tracking-tight">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-text-muted font-medium">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-surface border border-border p-8 rounded-2xl shadow-sm flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl">
                    <Icon icon={feature.icon} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-primary">
                      {feature.title}
                    </h3>
                    <p className="text-text-muted leading-7 font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-background relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-3xl font-black text-primary tracking-tight">
              {t("home.howItWorks.title")}
            </h2>
            <p className="text-lg text-text-muted font-medium">
              {t("home.howItWorks.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="bg-surface border border-border p-8 rounded-[2rem] shadow-sm relative flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-xl">
                      <Icon icon={step.icon} />
                    </div>
                    <span className="text-4xl font-black text-accent/50 select-none">
                      {index + 1}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-primary">
                      {step.title}
                    </h3>
                    <p className="text-text-muted leading-7 font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-surface-muted/50 border-y border-border/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-4">
            <h2 className="text-3xl font-black text-primary tracking-tight">
              {t("home.faq.title")}
            </h2>
            <p className="text-lg text-text-muted font-medium">
              {t("home.faq.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 hidden lg:block relative w-full aspect-square">
              <Image
                src="/images/faqs.png"
                alt={t("home.faq.title")}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="lg:col-span-7">
              <Collapse items={faqItems} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface">
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
