import Image from "next/image";
import { Icon } from "@/app/components/Icon";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { Link } from "@/i18n/navigation";
import { _Translator } from "next-intl";
import { getTranslations } from "next-intl/server";

const socialLinks = [
  {
    link: "https://github.com/Haitham-26",
    icon: faGithub,
  },
  {
    link: "https://www.linkedin.com/in/haitham-waki-37b095297",
    icon: faLinkedinIn,
  },
  {
    link: "https://www.instagram.com/h1waki",
    icon: faInstagram,
  },
  {
    link: "mailto:haitham.waki.work@gmail.com",
    icon: faEnvelope,
  },
];

const getPublicPlatformLinks = (t: _Translator) => [
  {
    path: "/",
    title: t("app.links.public.home"),
  },
  {
    path: "/how-it-works",
    title: t("app.links.public.howItWorks"),
  },
  {
    path: "/signup",
    title: t("app.links.public.signUp"),
  },
  {
    path: "/login",
    title: t("app.links.public.login"),
  },
];

const getLegalLinks = (t: _Translator) => [
  {
    path: "/terms-and-conditions",
    title: t("app.links.public.terms"),
  },
  {
    path: "/privacy-policy",
    title: t("app.links.public.privacy"),
  },
];

export default async function Footer() {
  const t = await getTranslations();

  const publicPlatformLinks = getPublicPlatformLinks(t);
  const legalLinks = getLegalLinks(t);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] border-t border-white/10 mt-auto overflow-hidden">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt={t("app.name")}
                width={140}
                height={30}
                className="brightness-110"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              {t("app.description")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.link}
                  href={social.link}
                  target="_blank"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-accent/20 hover:border-accent/30 transition-all duration-300"
                >
                  <Icon icon={social.icon as IconProp} className="text-sm" />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              {t("footer.platoform.title")}
            </h4>
            <ul className="space-y-4">
              {publicPlatformLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              {t("footer.legal.title")}
            </h4>
            <ul className="space-y-4">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/10 relative group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-accent/20 transition-all"></div>

            <div className="flex items-center gap-3 text-white font-black text-sm justify-end flex-row-reverse relative z-10">
              <span>{t("footer.systemStatus.title")}</span>
              <Icon icon={faShieldHalved} className="text-accent" />
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">
                {t("footer.systemStatus.subtitle")}
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
              {t("footer.systemStatus.description")}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
            {t("footer.developedBy", { name: t("app.developer") })}
            <span> • </span>
            {t("footer.copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
