"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Question } from "@/model/question/Question";
import { Reply } from "@/model/reply/types/Reply";
import { Button } from "@/app/components/Button";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";

import { usePathname } from "next/navigation";
import { formattedDate } from "@/tools/Date";
import { QuestionReply } from "./QuestionReply";
import { NextClient } from "@/tools/NextClient";
import Link from "next/link";
import { Icon } from "@/app/components/Icon";
import { Toast } from "@/tools/Toast";
import { QuestionActions } from "./QuestionActions";
import { Textarea } from "@/app/components/Textarea";
import { Controller, useForm } from "react-hook-form";
import { ReplyDto } from "@/model/reply/dto/ReplyDto";
import { Input } from "@/app/components/Input";
import { Pagination } from "@/app/components/Pagination";
import { useSession } from "next-auth/react";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";

type QuestionCardProps = {
  question: Question;
  openRegisterModal?: VoidFunction;
  setPage?: (newPage: number) => void;
};

const REPLIES_LIMIT = 10;

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  openRegisterModal,
  setPage,
}) => {
  const { data, status } = useSession();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const [repliesPage, setRepliesPage] = useState(1);

  const { control, getValues, reset, handleSubmit, setValue, watch } = useForm<
    ReplyDto & { replyAsAnnonymous?: boolean }
  >({
    defaultValues: {
      questionId: question._id,
      reply: "",
      replierName: "",
      replyAsAnnonymous: true,
    },
  });

  const replyAsAnnonymous = watch("replyAsAnnonymous");

  const isOnProfilePage = !Boolean(pathname.replace("/questions", "").length);

  const isListView = isOnProfilePage || pathname === "/questions/public";

  const userId = data?.user?._id;

  const isOwner = userId && userId === question.userId;

  const { data: replies, isLoading: repliesLoading } = useQuery({
    queryKey: [
      "questions",
      question._id,
      "replies",
      {
        questionId: question._id,
        page: repliesPage,
        limit: REPLIES_LIMIT,
        userId,
      },
    ],

    queryFn: async () => {
      const { data } = await NextClient<DataWithMeta<Reply>>(
        `/questions/${question._id}/replies`,
        {
          method: "GET",
          params: {
            questionId: question._id,
            page: repliesPage,
            limit: REPLIES_LIMIT,
            userId,
          },
        },
      );

      return data;
    },

    enabled: !isListView && status !== "loading",
  });

  const replyMutation = useMutation({
    mutationFn: async (dto: ReplyDto) => {
      const { data } = await NextClient<Reply>("/replies", {
        method: "POST",
        data: {
          reply: dto.reply,
          replierName: dto.replierName,
          questionId: question._id,
        },
      });

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["questions", question._id, "replies"],
      });

      reset();

      Toast.success("تم إرسال الرد بنجاح");
    },

    onError: (error) => {
      Toast.apiError(error);
    },
  });

  const onShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/questions/${question._id}`,
    );

    Toast.success("تم نسخ الرابط بنجاح");
  };

  const onReply = () => {
    const dto = getValues();

    if (!dto.reply.trim()) {
      return;
    }

    replyMutation.mutate(dto);
  };

  return (
    <div className="max-w-2xl mx-auto w-full bg-surface border border-border rounded-2xl p-5 sm:p-7">
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
          href={`/questions/${question._id}`}
          className="group/title flex items-center justify-between gap-3"
        >
          <h2 className="text-lg font-bold text-text-primary leading-snug line-clamp-2 group-hover/title:text-accent transition-colors">
            {question.question}
          </h2>

          <Icon
            icon={faAngleLeft}
            className="text-text-muted shrink-0 group-hover/title:text-accent transition-colors"
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
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {replies.data.map((reply) => (
                <QuestionReply
                  key={reply._id}
                  reply={reply}
                  openRegisterModal={openRegisterModal}
                />
              ))}

              <Pagination meta={replies.meta} onPageChange={setRepliesPage} />
            </div>
          ) : (
            <p className="text-text-muted text-sm text-center py-4">
              لا توجد ردود بعد، كن أول من يرد
            </p>
          )}

          <div className="pt-2 space-y-3">
            <Controller
              control={control}
              name="reply"
              render={({ field: { value, onChange } }) => (
                <Textarea
                  value={value}
                  onChange={onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onReply();
                    }
                  }}
                  placeholder="اكتب ردك هنا..."
                />
              )}
            />

            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor={`reply-as-anonymous-${question._id}`}
                className="flex items-center gap-2 text-xs font-bold text-text-muted cursor-pointer select-none shrink-0"
              >
                <Controller
                  control={control}
                  name="replyAsAnnonymous"
                  render={({ field: { value, onChange } }) => (
                    <input
                      id={`reply-as-anonymous-${question._id}`}
                      type="checkbox"
                      checked={value}
                      onChange={(e) => {
                        onChange(e.target.checked);
                        setValue("replierName", "");
                      }}
                      className="accent-accent cursor-pointer"
                    />
                  )}
                />
                هوية مجهولة
              </label>

              <Controller
                control={control}
                name="replierName"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="اسمك المستعار"
                    value={value}
                    onChange={onChange}
                    classNames={{
                      container: `flex-1 min-w-[120px] ${
                        replyAsAnnonymous ? "opacity-0 pointer-events-none" : ""
                      }`,
                      input: "h-9 !text-xs",
                    }}
                  />
                )}
              />

              <Button
                loading={replyMutation.isPending}
                onClick={handleSubmit(onReply)}
                icon={faPaperPlane}
                className="!h-9 !px-4 !text-xs !font-bold !bg-primary !text-secondary hover:!bg-accent transition-colors shrink-0 w-full sm:w-auto sm:ms-auto"
              >
                إرسال
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
        <Button
          onClick={onShare}
          icon={faShareNodes}
          className="text-xs bg-surface-muted shadow-none font-bold !text-text-muted hover:bg-surface-muted"
        >
          مشاركة
        </Button>

        {isOnProfilePage && isOwner ? (
          <QuestionActions question={question} setPage={setPage} />
        ) : null}
      </div>
    </div>
  );
};
