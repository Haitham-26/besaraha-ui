"use client";

import { Button } from "@/app/components/Button";
import { Icon } from "@/app/components/Icon";
import { SendMessageDto } from "@/model/message/SendMessageDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { faCheck } from "@fortawesome/free-solid-svg-icons/faCheck";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faPenNib } from "@fortawesome/free-solid-svg-icons/faPenNib";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/app/components/Textarea";
import { Input } from "@/app/components/Input";

type Props = {
  username: string;
};

export const SendMessageForm: React.FC<Props> = ({ username }) => {
  const [loading, setLoading] = useState(false);

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
      const dto = getValues();
      await NextClient(`/message/${username}/send-message`, {
        method: "POST",
        data: dto,
      });
      reset();
      Toast.success("تم إرسال رسالتك بنجاح");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="relative group">
        <div className="flex items-center gap-3 mb-4 text-slate-300 font-bold text-sm uppercase tracking-widest">
          <Icon icon={faPenNib} className="text-accent text-xs" />
          <span>محتوى الرسالة</span>
        </div>

        <Controller
          control={control}
          name="message"
          rules={{
            required: "لا يمكنك إرسال رسالة فارغة",
            maxLength: { value: 1024, message: "الرسالة طويلة جداً" },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Textarea
              value={value}
              onChange={onChange}
              placeholder="اكتب شيئاً لا تستطيع قوله في العلن..."
              className={`
                  w-full min-h-[220px] p-8 rounded-[2.5rem] border outline-none transition-all duration-500 resize-none text-lg font-medium
                  bg-white/[0.03] text-white placeholder:text-slate-600
                  ${
                    error
                      ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-white/10 focus:border-accent focus:ring-4 focus:ring-accent/10 focus:bg-white/[0.05]"
                  }
                `}
              valid={!error}
              errorMessage={error?.message}
              maxLength={1024}
            />
          )}
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 bg-white/[0.02] rounded-[2rem] border border-white/5">
        <div className="flex flex-wrap items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={asAnnonymous}
                onChange={(e) => onCheckAnonymous(e.target.checked)}
                className="peer appearance-none w-6 h-6 border border-white/20 rounded-lg checked:bg-accent checked:border-accent transition-all cursor-pointer"
              />
              <Icon
                icon={faCheck}
                className="absolute left-1.5 text-[10px] text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex items-center gap-2">
              <Icon
                icon={faUserSecret}
                className={`text-sm transition-colors ${
                  asAnnonymous ? "text-accent" : "text-slate-500"
                }`}
              />
              <span className="text-sm font-bold text-slate-300">
                إرسال مجهول
              </span>
            </div>
          </label>

          {!asAnnonymous ? (
            <div className="w-full md:w-fit animate-in fade-in slide-in-from-right-2 duration-300">
              <Controller
                control={control}
                name="senderName"
                rules={{ maxLength: 32 }}
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="ضع اسماً مستعاراً"
                    value={value}
                    onChange={onChange}
                    classNames={{
                      input:
                        "!bg-white/5 !border-white/10 !text-white h-11 px-6 rounded-xl text-sm w-full md:w-52 focus:!border-accent/50",
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
          className="h-14 px-12 !bg-accent hover:!bg-accent/90 text-white rounded-2xl font-black text-lg shadow-2xl shadow-accent/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
        >
          <span>إرسال</span>
          <Icon icon={faPaperPlane} className="text-sm" />
        </Button>
      </div>
    </div>
  );
};
