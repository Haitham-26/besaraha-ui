import { getTranslations } from "next-intl/server";
import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { ForgotPasswordNewContent } from "./_components/ForgotPasswordNewContent";

export default async function Page() {
  const t = await getTranslations("forgotPasswordNew");

  return (
    <AuthFormContainer title={t("title")} subtitle={t("subtitle")}>
      <p className="text-text-muted text-sm">{t("description")}</p>

      <ForgotPasswordNewContent />
    </AuthFormContainer>
  );
}
