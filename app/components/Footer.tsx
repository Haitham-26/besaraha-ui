import Image from "next/image";
import { Icon } from "@/app/components/Icon";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons/faShieldHalved";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons/faLinkedinIn";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { Link } from "@/i18n/navigation";

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

const publicLinks = [
  {
    path: "/",
    title: "الصفحة الرئيسية",
  },
  {
    path: "/how-it-works",
    title: "كيفية الاستخدام",
  },
  {
    path: "/signup",
    title: "إنشاء حساب",
  },
  {
    path: "/login",
    title: "تسجيل الدخول",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0f172a] border-t border-white/10 mt-auto overflow-hidden">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4 space-y-8 text-right">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="بصراحة"
                width={140}
                height={30}
                className="brightness-110"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              نؤمن بأن الحقيقة تبني علاقات أقوى، لذا وفرنا لك المساحة لتقول ما
              تريد بكل أمان.
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

          <div className="md:col-span-2 space-y-6 text-right">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              المنصة
            </h4>
            <ul className="space-y-4">
              {publicLinks.map((link) => (
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

          <div className="md:col-span-2 space-y-6 text-right">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">
              القانونية
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 bg-white/5 rounded-[2.5rem] p-8 space-y-6 border border-white/10 text-right relative group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:bg-accent/20 transition-all"></div>

            <div className="flex items-center gap-3 text-white font-black text-sm justify-end flex-row-reverse relative z-10">
              <Icon icon={faShieldHalved} className="text-accent" />
              <span>حالة النظام</span>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">
                جميع الخدمات تعمل بكفاءة
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight relative z-10">
              يتم تحديث الأنظمة دورياً لضمان تشفير بياناتك بنسبة 100% عبر
              بروتوكولات حماية متطورة.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
            تم التطوير بواسطة هيثم &copy; {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
}
