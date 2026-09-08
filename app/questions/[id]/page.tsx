import { Question } from "@/model/question/Question";
import getToken from "@/tools/getToken";
import { notFound } from "next/navigation";
import { AuthClient } from "@/tools/AuthClient";
import QuestionCard from "../_components/QuestionCard";
import { SignupRequiredModal } from "./_components/SignupRequiredModal";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const [{ id }, token] = await Promise.all([params, getToken()]);

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
        <QuestionCard
          question={question}
          pathname={`/questions/${question._id}`}
          normalizedParams={null}
        />

        <SignupRequiredModal question={question} />
      </div>
    </main>
  );
}
