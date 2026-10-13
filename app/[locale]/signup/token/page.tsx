import { redirect } from "@/i18n/navigation";
import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { SignUpTokenContent } from "./_components/SignUpTokenContent";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { getLocale, getTranslations } from "next-intl/server";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const [{ email }, locale, t] = await Promise.all([
    searchParams,
    getLocale(),
    getTranslations("signupToken"),
  ]);

  if (!email) {
    return redirect({
      href: "/signup",
      locale: locale || AppLangs.EN,
    });
  }

  return (
    <AuthFormContainer
      title={t.rich("title", {
        span: (chunk) => <span className="text-accent">{chunk}</span>,
      })}
    >
      <SignUpTokenContent email={email} />
    </AuthFormContainer>
  );
}
