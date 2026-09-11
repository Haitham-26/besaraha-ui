import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { ForgotPasswordNewContent } from "./_components/ForgotPasswordNewContent";

export default async function Page() {
  return (
    <AuthFormContainer title="استرجاع كلمة السر" subtitle="تعيين كلمة سر جديدة">
      <p className="text-text-muted text-sm">
        قم بإدخال كلمة سر جديدة وتأكيدها، سيتم تغيير كلمة السر الخاصة بحسابك
        ويمكنك بعدها تسجيل الدخول باستخدامها.
      </p>

      <ForgotPasswordNewContent />
    </AuthFormContainer>
  );
}
