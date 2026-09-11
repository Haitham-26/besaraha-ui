import { redirect } from "@/i18n/navigation";
import { AuthFormContainer } from "../../../components/AuthFormContainer";
import { SignUpTokenContent } from "./_components/SignUpTokenContent";
import { cookies } from "next/headers";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const [{ email = "" }, _cookies] = await await Promise.all([
    searchParams,
    cookies(),
  ]);

  if (!email) {
    return redirect({
      href: "/signup",
      locale: _cookies.get("locale")?.value || AppLangs.EN,
    });
  }

  return (
    <AuthFormContainer title="بصراحة">
      <SignUpTokenContent email={email} />
    </AuthFormContainer>
  );
}
