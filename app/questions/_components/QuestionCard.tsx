"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Question } from "@/model/question/Question";
import { Reply } from "@/model/reply/types/Reply";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";

import { formattedDate } from "@/tools/Date";
import QuestionReply from "./replies/QuestionReply";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/app/components/Icon";
import { QuestionActions } from "./QuestionActions";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { QuestionReplyForm } from "./replies/QuestionReplyForm";
import { Pagination } from "@/app/components/Pagination";
import { NextClient } from "@/tools/NextClient";
import { useSearchParams } from "next/navigation";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { useLocale, useTranslations } from "next-intl";

type QuestionCardProps = {
  question: Question;
  pathname: string;
  normalizedParams: {
    page: number;
    limit: number;
    isPublic?: boolean;
  } | null;
};

const REPLIES_LIMIT = 10;

export default function QuestionCard({
  question,
  pathname,
  normalizedParams,
}: QuestionCardProps) {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const isOnProfilePage = pathname === "/questions";
  const isListView = isOnProfilePage || pathname === "/public-questions";

  const userId = session?.user?._id;
  const isOwner = question.userId === userId;

  const lang = useLocale();

  const prefix = lang !== AppLangs.EN ? `/${lang}` : "";

  const repliesPage = Number(searchParams.get("page") || 1) || 1;

  const getRepliesParams = {
    questionId: question._id,
    page: repliesPage,
    limit: REPLIES_LIMIT,
    userId,
  };

  const {
    data: replies,
    isLoading: repliesLoading,
    isFetching: repliesFetching,
  } = useQuery({
    queryKey: ["questions", question._id, "replies", getRepliesParams],

    queryFn: async () => {
      const { data } = await NextClient<DataWithMeta<Reply>>(
        `/questions/${question._id}/replies`,
        {
          method: "GET",
          params: getRepliesParams,
        },
      );

      return data;
    },

    enabled: !isListView && status !== "loading",
  });

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-5 sm:p-7">
      <div className="flex items-center justify-between mb-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <Icon icon={faClock} className="text-accent" />

          <span className="dir-ltr">{formattedDate(question.createdAt)}</span>
        </span>

        {isOnProfilePage && isOwner ? (
          <span className="bg-surface-muted rounded-3xl flex items-center gap-1 font-bold text-[10px] py-2 px-3">
            <Icon icon={question.isPublic ? faEarthAmericas : faLock} />

            {question.isPublic ? "عام" : "خاص"}
          </span>
        ) : null}
      </div>

      {isListView ? (
        <Link
          href={`${prefix}/question/${question._id}`}
          className="group/title flex items-center justify-between gap-3"
        >
          <h2 className="text-lg font-bold text-text-primary leading-snug line-clamp-2 group-hover/title:text-accent transition-colors">
            {question.question}
          </h2>

          <Icon
            icon={faAngleLeft}
            className="text-text-muted shrink-0 group-hover/title:text-accent transition-colors ltr:rotate-180"
          />
        </Link>
      ) : (
        <h2 className="text-xl sm:text-2xl font-black text-text-primary leading-snug">
          {question.question}
        </h2>
      )}

      {!isListView ? (
        <div className="mt-6 space-y-4">
          {repliesLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : replies?.data?.length ? (
            <div
              className={`space-y-3 max-h-[420px] overflow-y-auto pr-1 ${
                repliesFetching ? "opacity-60" : ""
              }`}
            >
              {replies.data.map((reply) => (
                <QuestionReply key={reply._id} reply={reply} />
              ))}

              <Pagination
                meta={replies.meta}
                pathname={pathname}
                searchParams={searchParams}
                shouldUseLocalePrefix
              />
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4">
              لا توجد ردود بعد، كن أول من يرد
            </p>
          )}

          <QuestionReplyForm
            question={question}
            getRepliesParams={getRepliesParams}
          />
        </div>
      ) : null}

      <QuestionActions
        question={question}
        normalizedParams={normalizedParams}
      />
    </div>
  );
}
