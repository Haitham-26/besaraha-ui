"use client";

import { Button } from "@/app/components/Button";
import { OTPInput } from "@/app/components/OTPInput";
import { ResendTokenButton } from "@/app/components/ResendTokenButton";
import { ForgotPasswordTokenDto } from "@/model/auth/forgot-password/dto/ForgotPasswordTokenDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const RESEND_LOCALSTORAGE_KEY = "resend-forgot-password-token-last-sent";

export const ForgotPasswordTokenContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { control, getValues, handleSubmit, reset, watch } =
    useForm<ForgotPasswordTokenDto>({
      defaultValues: {
        email: searchParams.get("email") || "",
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

      Toast.success(
        "تم التحقق من البريد الإلكتروني بنجاح. قم بتعيين كلمة مرور جديدة وتأكيدها.",
      );

      router.replace(
        `/auth/forgot-password/new?email=${searchParams.get("email")}&token=${dto.token}`,
      );
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  const onResendToken = async () => {
    const email = getValues("email");

    await NextClient("/auth/forgot-password/token-send", {
      method: "POST",
      data: { email },
    });
  };

  useEffect(() => {
    const email = searchParams.get("email");

    if (!email) {
      router.replace("/auth/forgot-password/email");
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
          render={({ field: { value, onChange } }) => (
            <OTPInput value={value} onChange={onChange} length={6} />
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
