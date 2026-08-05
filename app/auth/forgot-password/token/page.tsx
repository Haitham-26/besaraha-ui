import { AuthFormContainer } from "../../_components/AuthFormContainer";
import { ForgotPasswordTokenContent } from "./_components/ForgotPasswordTokenContent";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { email = "" } = await searchParams;

  return (
    <AuthFormContainer
      title="استرجاع كلمة السر"
      subtitle="التحقق من البريد الإلكتروني"
    >
      <p className="text-text-muted text-sm leading-7">
        <span className="block">
          لقد قمنا بإرسال رمز التحقق إلى بريدك الإلكتروني
          <span className="font-bold text-white/70"> {email} </span>، يرجى
          إدخاله في الحقل في الأسفل حتى تتمكن من تعيين كلمة سر جديدة.
        </span>

        <span className="block">
          إن لم تجد البريد في صندوق الوارد، يرجى التحقق من صندوق الرسائل غير
          المرغوب فيها (Spam أو Junk).
        </span>
      </p>

      <ForgotPasswordTokenContent />
    </AuthFormContainer>
  );
}
