import { redirect } from "next/navigation";
import { AuthFormContainer } from "../../_components/AuthFormContainer";
import { SignUpTokenContent } from "./_components/SignUpTokenContent";

type Props = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function Page({ searchParams }: Props) {
  const { email = "" } = await searchParams;

  if (!email) {
    return redirect("/auth/signup");
  }

  return (
    <AuthFormContainer title="بصراحة">
      <SignUpTokenContent email={email} />
    </AuthFormContainer>
  );
}
