"use client";

import { AuthInput } from "@/app/auth/_components/AuthInput";
import { Button } from "@/app/components/Button";
import { ForgotPasswordNewDto } from "@/model/auth/forgot-password/dto/ForgotPasswordNewDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ForgotPasswordNewContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

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

      Toast.success("تمت إعادة تعيين كلمة المرور بنجاح");

      router.replace("/auth/login");
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
      router.replace("/auth/forgot-password/email");
    }
  }, [reset, router, searchParams]);

  return (
    <Fragment>
      <Controller
        control={control}
        name="password"
        rules={{
          required: "كلمة السر مطلوبة",
          minLength: {
            value: 8,
            message: "كلمة السر يجب أن تكون 8 رموز على الأقل",
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AuthInput
            title="كلمة السر الجديدة"
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
          required: "تأكيد كلمة السر مطلوب",
          validate: (value) => value === password || "كلمات السر غير متطابقة",
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AuthInput
            title="تأكيد كلمة السر الجديدة"
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
        استمرار
      </Button>
    </Fragment>
  );
};
