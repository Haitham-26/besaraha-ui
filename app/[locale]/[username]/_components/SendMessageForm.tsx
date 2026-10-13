"use client";

import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { SendMessageDto } from "@/model/message/SendMessageDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/app/components/Textarea";
import { Input } from "@/app/components/Input";
import { useTranslations } from "next-intl";

type Props = {
  username: string;
};

export const SendMessageForm: React.FC<Props> = ({ username }) => {
  const [loading, setLoading] = useState(false);
  const t = useTranslations();

  const {
    control,
    getValues,
    handleSubmit,
    reset,
    watch,
    setValue,
    resetField,
  } = useForm<SendMessageDto & { asAnnonymous: boolean }>({
    defaultValues: {
      message: "",
      senderName: "",
      recipientUsername: username,
      asAnnonymous: true,
    },
  });

  const asAnnonymous = watch("asAnnonymous");

  const onCheckAnonymous = (checked: boolean) => {
    setValue("asAnnonymous", checked);
    resetField("senderName");
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      await NextClient(`/messages/${username}/send-message`, {
        method: "POST",
        data: getValues(),
      });

      reset();
      Toast.success(t("sendMessage.form.success"));
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-black text-primary">
          {t("sendMessage.form.label")}
        </label>

        <Controller
          control={control}
          name="message"
          rules={{
            required: t("errors.fieldRequired"),
            maxLength: {
              value: 1024,
              message: t("errors.maxLength", {
                length: 1024,
              }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Textarea
              value={value}
              onChange={onChange}
              placeholder={t("sendMessage.form.placeholder")}
              className={`w-full min-h-[180px] p-5 rounded-2xl border outline-none transition-all resize-none text-base font-medium bg-surface text-primary placeholder:text-text-muted ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-border focus:border-accent"
              }`}
              valid={!error}
              errorMessage={error?.message}
              maxLength={1024}
            />
          )}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={asAnnonymous}
                onChange={(e) => onCheckAnonymous(e.target.checked)}
                className="peer appearance-none w-5 h-5 border border-border rounded-md checked:bg-accent checked:border-accent transition-all cursor-pointer"
              />
              <Icon
                icon={faCheck}
                className="absolute left-1 text-[10px] text-secondary opacity-0 peer-checked:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon={faUserSecret}
                className={`text-sm transition-colors ${
                  asAnnonymous ? "text-accent" : "text-text-muted"
                }`}
              />
              <span className="text-sm font-bold text-primary">
                {t("sendMessage.form.anonymousLabel")}
              </span>
            </div>
          </label>

          {!asAnnonymous ? (
            <div className="w-full sm:w-48">
              <Controller
                control={control}
                name="senderName"
                rules={{
                  maxLength: {
                    value: 32,
                    message: t("errors.maxLength", {
                      length: 32,
                    }),
                  },
                }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder={t("sendMessage.form.senderPlaceholder")}
                    value={value}
                    onChange={onChange}
                    classNames={{
                      input:
                        "h-10 px-4 rounded-xl text-sm w-full bg-surface border-border text-primary focus:border-accent",
                    }}
                  />
                )}
              />
            </div>
          ) : null}
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          icon={faPaperPlane}
        >
          {t("sendMessage.form.button")}
        </Button>
      </div>
    </div>
  );
};
