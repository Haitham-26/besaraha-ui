import { getTranslations } from "next-intl/server";
import { AuthFormContainer } from "../../components/AuthFormContainer";
import { SignUpEmailContent } from "./_components/SignUpEmailContent";
import { Link } from "@/i18n/navigation";

const linkClass =
  "text-slate-300 underline decoration-accent/40 underline-offset-6 cursor-pointer hover:text-accent transition-all";

export default async function Page() {
  const t = await getTranslations("signup");

  return (
    <AuthFormContainer
      title={t.rich("title", {
        span: (chunk) => <span className="text-accent">{chunk}</span>,
      })}
      subtitle={t("subtitle")}
    >
      <SignUpEmailContent />

      <div className="mt-8 text-center space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
          {t.rich("disclaimer", {
            br: () => <br />,
            termsLink: (chunk) => (
              <Link href="/terms" className={linkClass}>
                {chunk}
              </Link>
            ),
            privacyLink: (chunk) => (
              <Link href="/privacy-policy" className={linkClass}>
                {chunk}
              </Link>
            ),
          })}
          <br />
        </p>
      </div>
    </AuthFormContainer>
  );
}
