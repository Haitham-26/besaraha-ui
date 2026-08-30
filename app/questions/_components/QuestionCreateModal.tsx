"use client";

import { Button } from "@/app/components/Button";
import { CreateQuestionDto } from "@/model/question/dto/CreateQuestionDto";
import { Question } from "@/model/question/Question";
import { NextClient } from "@/tools/NextClient";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "@/app/components/Modal";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";
import { Toast } from "@/tools/Toast";
import { Textarea } from "@/app/components/Textarea";
import { Icon } from "@/app/components/Icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type QuestionCreateModalProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const QuestionCreateModal: React.FC<QuestionCreateModalProps> = ({
  onClose,
  open = false,
}) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CreateQuestionDto>({
      defaultValues: {
        question: "",
        isPublic: false,
      },
    });

  const isPublic = watch("isPublic");

  const createQuestionMutation = useMutation({
    mutationFn: async (dto: CreateQuestionDto) => {
      const { data } = await NextClient<Question>("/questions/create", {
        method: "POST",
        data: dto,
      });

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["questions"],
      });

      reset({
        question: "",
        isPublic: false,
      });

      Toast.success("تم نشر سؤالك بنجاح");

      onClose();
    },

    onError: (error) => {
      Toast.apiError(error);
    },
  });

  const onSubmit = (values: CreateQuestionDto) => {
    createQuestionMutation.mutate({
      ...values,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="إضافة سؤال جديد">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 bg-accent/5 p-4 rounded-2xl border border-accent/10">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
            <Icon icon={faCircleQuestion} className="text-xl" />
          </div>

          <div>
            <h4 className="text-sm font-black text-text-primary">
              ماذا يدور في ذهنك؟
            </h4>

            <p className="text-xs text-text-muted font-medium">
              سيتمكن الجميع من الرد على سؤالك فور نشره.
            </p>
          </div>
        </div>

        <Controller
          control={control}
          name="question"
          rules={{
            required: "يرجى كتابة السؤال أولاً",
            minLength: {
              value: 5,
              message: "السؤال قصير جداً",
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <div className="flex flex-col gap-2">
              <Textarea
                title="نص السؤال"
                value={value}
                onChange={onChange}
                placeholder="مثال: ما هو أفضل كتاب قرأته هذا العام؟"
                className={`
                  w-full min-h-[140px] p-5 rounded-2xl border-2 outline-none transition-all duration-300 resize-none
                  bg-surface text-text-primary placeholder:text-text-muted/50
                  ${
                    error
                      ? "border-danger focus:ring-4 focus:ring-danger/10"
                      : "border-border focus:border-accent focus:ring-4 focus:ring-accent/10"
                  }
                `}
                errorMessage={error?.message}
              />
            </div>
          )}
        />

        <div className="flex flex-col gap-3">
          <label className="text-sm font-bold text-text-primary px-1">
            خصوصية السؤال
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setValue("isPublic", false)}
              className={`cursor-pointer flex flex-col gap-2 p-4 rounded-2xl border-2 text-right transition-all ${
                isPublic === false
                  ? "border-accent bg-accent/5 ring-4 ring-accent/5"
                  : "border-border bg-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={faLock}
                  className={
                    isPublic === false ? "text-accent" : "text-text-muted"
                  }
                />

                <span className="font-bold text-sm">سؤال خاص</span>
              </div>

              <p className="text-[10px] leading-relaxed text-text-muted">
                يظهر فقط لمن يملك الرابط المباشر
              </p>
            </button>

            <button
              type="button"
              onClick={() => setValue("isPublic", true)}
              className={`cursor-pointer flex flex-col gap-2 p-4 rounded-2xl border-2 text-right transition-all ${
                isPublic
                  ? "border-accent bg-accent/5 ring-4 ring-accent/5"
                  : "border-border bg-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  icon={faEarthAmericas}
                  className={isPublic ? "text-accent" : "text-text-muted"}
                />

                <span className="font-bold text-sm">سؤال عام</span>
              </div>

              <p className="text-[10px] leading-relaxed text-text-muted">
                يظهر في صفحة الأسئلة العامة للجميع
              </p>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={createQuestionMutation.isPending}
            variant="primary"
            className="h-14 w-full shadow-xl shadow-accent/20 text-lg"
            icon={faPaperPlane}
          >
            نشر السؤال الآن
          </Button>

          <Button
            onClick={onClose}
            className="!bg-transparent shadow-none h-12 w-full !text-text-muted font-bold hover:!text-text-primary transition-colors text-sm"
          >
            إلغاء وتجاهل
          </Button>
        </div>
      </div>
    </Modal>
  );
};
