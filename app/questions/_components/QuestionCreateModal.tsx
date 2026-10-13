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
import { useTranslations } from "next-intl";

type QuestionCreateModalProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const QuestionCreateModal: React.FC<QuestionCreateModalProps> = ({
  open = false,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const t = useTranslations();

  const { control, handleSubmit, reset, setValue, watch } =
    useForm<CreateQuestionDto>({
      defaultValues: {
        question: "",
        isPublic: false,
      },
    });

  const isPublic = watch("isPublic");

  const localOnClose = () => {
    onClose();
    reset({
      question: "",
      isPublic: false,
    });
  };

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
        queryKey: ["questions", "user"],
      });

      reset({
        question: "",
        isPublic: false,
      });

      Toast.success(t("questions.create.success"));

      localOnClose();
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
    <Modal open={open} onClose={localOnClose} title="إضافة سؤال جديد">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 bg-accent/5 p-4 rounded-2xl border border-accent/10">
          <Icon icon={faCircleQuestion} className="text-xl text-accent" />

          <div className="space-y-1 min-w-0">
            <h4 className="text-sm font-black text-text-primary">
              {t("questions.create.title")}
            </h4>

            <p className="text-xs text-text-muted font-medium leading-relaxed">
              {t("questions.create.description")}
            </p>
          </div>
        </div>

        <Controller
          control={control}
          name="question"
          rules={{
            required: t("errors.fieldRequired"),
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Textarea
              title={t("questions.create.question.title")}
              value={value}
              onChange={onChange}
              placeholder={t("questions.create.question.placeholder")}
              errorMessage={error?.message}
            />
          )}
        />

        <div className="flex flex-col gap-3 p-4 bg-surface border border-border rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center text-base shrink-0">
              <Icon icon={isPublic ? faEarthAmericas : faLock} />
            </div>

            <label
              className="text-sm font-bold text-primary cursor-pointer flex-1"
              onClick={() => setValue("isPublic", !isPublic)}
            >
              {t("questions.create.showInCommunity.title")}
            </label>

            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setValue("isPublic", !isPublic)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isPublic ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-secondary shadow-md ring-0 transition duration-200 ease-in-out ${
                  isPublic
                    ? "ltr:translate-x-5 rtl:-translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <p className="text-xs text-text-muted font-medium leading-relaxed">
            {t.rich("questions.create.showInCommunity.description", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          loading={createQuestionMutation.isPending}
          variant="primary"
          className="w-full mt-2"
          icon={faPaperPlane}
        >
          {t("questions.create.submit")}
        </Button>
      </div>
    </Modal>
  );
};
