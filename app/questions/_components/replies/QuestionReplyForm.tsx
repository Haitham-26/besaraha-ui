"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Textarea } from "@/app/components/Textarea";
import { Question } from "@/model/question/Question";
import { ReplyDto } from "@/model/reply/dto/ReplyDto";
import { Reply } from "@/model/reply/types/Reply";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";

type QuestionReplyFormProps = {
  question: Question;
  getRepliesParams: {
    questionId: string;
    page: number;
    limit: number;
    userId?: string;
  };
};

export const QuestionReplyForm: React.FC<QuestionReplyFormProps> = ({
  question,
  getRepliesParams,
}) => {
  const queryClient = useQueryClient();
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
        queryKey: ["questions", question._id, "replies", getRepliesParams],
      });

      reset();

      Toast.success("تم إرسال الرد بنجاح");
    },

    onError: (error) => {
      Toast.apiError(error);
    },
  });

  const replyAsAnnonymous = watch("replyAsAnnonymous");

  const onReply = () => {
    const dto = getValues();

    if (!dto.reply.trim()) {
      return;
    }

    replyMutation.mutate(dto);
  };

  return (
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
  );
};
