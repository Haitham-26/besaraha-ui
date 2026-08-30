import { Question } from "@/model/question/Question";
import { QuestionCardWithSignupModal } from "./_components/QuestionCardWithSignupModal";
import getToken from "@/tools/getToken";
import { notFound } from "next/navigation";
import { AuthClient } from "@/tools/AuthClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page(props: Props) {
  const { id } = await props.params;

  const token = await getToken();

  let question: Question | null = null;

  try {
    const { data } = await AuthClient<Question>(
      `/questions/${id}`,
      {
        method: "GET",
      },
      token,
    );

    question = data;
  } catch (e: any) {
    console.log(e);
  }

  if (!question) {
    return notFound();
  }

  return (
    <main className="px-4 md:px-8 py-6 flex-1">
      <div className="md:max-w-2xl mx-auto">
        <QuestionCardWithSignupModal question={question} />
      </div>
    </main>
  );
}
