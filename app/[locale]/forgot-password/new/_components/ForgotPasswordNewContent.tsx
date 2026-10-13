"use client";

import { AuthInput } from "@/app/components/AuthInput";
import { Button } from "@/app/components/Button";
import { useRouter } from "@/i18n/navigation";
import { ForgotPasswordNewDto } from "@/model/auth/forgot-password/dto/ForgotPasswordNewDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

export const ForgotPasswordNewContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { control, handleSubmit, watch, reset, getValues } = useForm<
    ForgotPasswordNewDto & { passwordConfirm: string }
  >({
    defaultValues: {
      email: searchParams.get("email") || "",
      token: searchParams.get("token") || "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [password, passwordConfirm] = watch(["password", "passwordConfirm"]);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const data = {
        email: searchParams.get("email") || "",
        token: searchParams.get("token") || "",
        password: getValues("password"),
        passwordConfirm: getValues("passwordConfirm"),
      };

      await NextClient("/auth/forgot-password/new", {
        method: "POST",
        data,
      });

      Toast.success(t("forgotPasswordNew.success"));

      router.replace("/login");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      router.replace("/forgot-password/email");
    }
  }, [reset, router, searchParams]);

  return (
    <Fragment>
      <Controller
        control={control}
        name="password"
        rules={{
          required: t("errors.fieldRequired"),
          minLength: {
            value: MAX_PASSWORD_LENGTH,
            message: t("errors.minLength", { length: MIN_PASSWORD_LENGTH }),
          },
          maxLength: {
            value: MAX_PASSWORD_LENGTH,
            message: t("errors.maxLength", { length: MAX_PASSWORD_LENGTH }),
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AuthInput
            title={t("forgotPasswordNew.newPassword")}
            value={value}
            onChange={onChange}
            valid={!error}
            errorMessage={error?.message}
            type="password"
            required
          />
        )}
      />

      <Controller
        control={control}
        name="passwordConfirm"
        rules={{
          required: t("errors.fieldRequired"),
          validate: (value) => value === password || "كلمات السر غير متطابقة",
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AuthInput
            title={t("forgotPasswordNew.confirmNewPassword")}
            value={value}
            onChange={onChange}
            valid={!error}
            errorMessage={error?.message}
            type="password"
            required
          />
        )}
      />

      <Button
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        disabled={!password || !passwordConfirm}
      >
        {t("common.continue")}
      </Button>
    </Fragment>
  );
};
