import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { ForgotPasswordEmailContent } from "./_components/ForgotPasswordEmailContent";

export default async function Page() {
  return (
    <AuthFormContainer
      title="استرجاع كلمة السر"
      subtitle="أدخل بريدك الإلكتروني"
    >
      <p className="text-text-muted text-sm">
        لإعادة تعيين كلمة السر، أولًا قم بإدخال البريد الإلكتروني الخاص بحسابك،
        وسنقوم بإرسال رمز تحقق إليه، ومن ثم ستتمكن من إعادة تعيين كلمة السر
      </p>

      <ForgotPasswordEmailContent />
    </AuthFormContainer>
  );
}
