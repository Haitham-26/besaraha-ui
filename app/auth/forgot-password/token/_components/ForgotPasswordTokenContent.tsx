"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { ResendTokenButton } from "@/app/components/ResendTokenButton";
import { ForgotPasswordTokenDto } from "@/model/auth/forgot-password/dto/ForgotPasswordTokenDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const inputClass = `
    !bg-white/[0.03] !border-white/10 !!h-14 
    !text-secondary text-lg
    !shadow-none
  `;

const RESEND_LOCALSTORAGE_KEY = "resend-forgot-password-token-last-sent";

export const ForgotPasswordTokenContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { control, getValues, handleSubmit, reset, watch } =
    useForm<ForgotPasswordTokenDto>({
      defaultValues: {
        email: "",
        token: "",
      },
    });

  const token = watch("token");

  const onSubmit = async () => {
    try {
      setLoading(true);
      const dto = getValues();

      await NextClient("/auth/forgot-password/token", {
        method: "POST",
        data: dto,
      });

      router.push(
        `/auth/forgot-password/new?email=${dto.email}&token=${dto.token}`,
      );
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  const onResendToken = async () => {
    try {
      const email = getValues("email");

      await NextClient("/auth/forgot-password/token-resend", {
        method: "POST",
        data: { email },
      });

      Toast.success("تم ارسال رمز التحقق إلى بريدك الإلكتروني");
    } catch (e) {
      Toast.apiError(e);
    }
  };

  useEffect(() => {
    const email = searchParams.get("email");
    if (!email) {
      router.replace("/auth/forgot-password/email");
    } else {
      reset({ email, token: "" });
    }
  }, [searchParams, router, reset]);

  return (
    <Fragment>
      <div className="space-y-4">
        <Controller
          control={control}
          name="token"
          rules={{
            required: "رمز التحقق مطلوب",
            minLength: { value: 6, message: "رمز التحقق يجب ان يكون 6 خانات" },
            maxLength: { value: 6, message: "رمز التحقق يجب ان يكون 6 خانات" },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              title="رمز التحقق"
              value={value}
              onChange={onChange}
              valid={!error}
              errorMessage={error?.message}
              className={inputClass}
              labelClassName="!text-slate-300 !font-black !tracking-widest"
              required
              maxLength={6}
              autoComplete="off"
            />
          )}
        />

        <ResendTokenButton
          localStorageKey={RESEND_LOCALSTORAGE_KEY}
          onResend={onResendToken}
        />
      </div>

      <Button
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        disabled={token?.length !== 6}
        className="mt-6"
      >
        تحقق واستمرار
      </Button>
    </Fragment>
  );
};
