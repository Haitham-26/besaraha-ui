import { getTranslations } from "next-intl/server";
import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { ForgotPasswordEmailContent } from "./_components/ForgotPasswordEmailContent";

export default async function Page() {
  const t = await getTranslations("forgotPasswordEmail");

  return (
    <AuthFormContainer title={t("title")} subtitle={t("subtitle")}>
      <p className="text-text-muted text-sm">{t("description")}</p>

      <ForgotPasswordEmailContent />
    </AuthFormContainer>
  );
}
