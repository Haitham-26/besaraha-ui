"use client";

import { Button } from "@/app/components/Button";
import { OTPInput } from "@/app/components/OTPInput";
import { ResendTokenButton } from "@/app/components/ResendTokenButton";
import { useRouter } from "@/i18n/navigation";
import { ForgotPasswordTokenDto } from "@/model/auth/forgot-password/dto/ForgotPasswordTokenDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const RESEND_LOCALSTORAGE_KEY = "resend-forgot-password-token-last-sent";

const TOKEN_LENGTH = 6;

export const ForgotPasswordTokenContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const t = useTranslations();
  const locale = useLocale();
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

      Toast.success(t("forgotPasswordToken.success"));

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
      data: {
        email,
        lang: locale,
      },
    });
  };

  useEffect(() => {
    const email = searchParams.get("email");

    if (!email) {
      router.replace("/forgot-password/email");
    }
  }, [searchParams, router, reset]);

  return (
    <Fragment>
      <div className="space-y-4">
        <Controller
          control={control}
          name="token"
          rules={{
            required: t("errors.token", {
              tokenLength: TOKEN_LENGTH,
            }),
            minLength: {
              value: TOKEN_LENGTH,
              message: t("errors.token", {
                tokenLength: TOKEN_LENGTH,
              }),
            },
            maxLength: {
              value: TOKEN_LENGTH,
              message: t("errors.token", {
                tokenLength: TOKEN_LENGTH,
              }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <OTPInput
              value={value}
              onChange={onChange}
              length={TOKEN_LENGTH}
              errorMessage={error?.message}
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
        disabled={!token || token.length !== TOKEN_LENGTH}
      >
        {t("forgotPasswordToken.button")}
      </Button>
    </Fragment>
  );
};
