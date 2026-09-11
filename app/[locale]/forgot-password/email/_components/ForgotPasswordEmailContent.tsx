"use client";

import { AuthInput } from "@/app/components/AuthInput";
import { Button } from "@/app/components/Button";
import { ForgotPasswordEmailDto } from "@/model/auth/forgot-password/dto/ForgotPasswordEmailDto";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export const ForgotPasswordEmailContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { control, getValues, handleSubmit, watch, reset } =
    useForm<ForgotPasswordEmailDto>({
      defaultValues: { email: "" },
    });

  const email = watch("email");

  const onSubmit = async () => {
    try {
      setLoading(true);

      const email = getValues("email");

      await NextClient("/auth/forgot-password/email", {
        method: "POST",
        data: {
          email,
        },
      });

      reset();

      router.replace(`/auth/forgot-password/token?email=${email}`);
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Controller
        control={control}
        name="email"
        rules={{ required: "البريد الإلكتروني مطلوب" }}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <AuthInput
            title="البريد الإلكتروني"
            value={value}
            onChange={onChange}
            valid={!error}
            errorMessage={error?.message}
            required
          />
        )}
      />

      <Button
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        disabled={!email}
      >
        استمرار
      </Button>
    </Fragment>
  );
};
