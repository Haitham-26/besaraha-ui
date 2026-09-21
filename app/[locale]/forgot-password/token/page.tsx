import { redirect } from "@/i18n/navigation";
import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { ForgotPasswordTokenContent } from "./_components/ForgotPasswordTokenContent";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const [{ email = "" }, locale, t] = await Promise.all([
    searchParams,
    getLocale(),
    getTranslations("forgotPasswordToken"),
  ]);

  if (!email) {
    return redirect({
      href: "/forgot-password/email",
      locale: locale || AppLangs.EN,
    });
  }

  return (
    <AuthFormContainer title={t("title")} subtitle={t("subtitle")}>
      <p className="text-text-muted text-sm leading-7">
        {t.rich("description", {
          email,
          span: (chunk) => (
            <span className="font-bold text-white/70">{chunk}</span>
          ),
        })}
      </p>

      <ForgotPasswordTokenContent />
    </AuthFormContainer>
  );
}
