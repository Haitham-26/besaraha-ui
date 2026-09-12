"use client";

import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "../../components/Button";
import { Toast } from "@/tools/Toast";
import { NextClient } from "@/tools/NextClient";
import { ResetPasswordDto } from "@/model/user/dto/ResetPasswordDto";
import { Input } from "@/app/components/Input";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { SignUpMethods } from "@/model/user/types/SignUpMethods.enum";
import { useRouter } from "next/navigation";

export default function Page() {
  const t = useTranslations();
  const router = useRouter();
  const { data, status } = useSession();

  const { control, handleSubmit, reset, getValues, watch, trigger } = useForm<
    ResetPasswordDto & { confirmPassword: string }
  >({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [newPassword, confirmPassword] = watch([
    "newPassword",
    "confirmPassword",
  ]);

  const mutation = useMutation({
    mutationFn: async () => {
      const dto = getValues();

      await NextClient("/user/reset-password", {
        method: "PATCH",
        data: {
          currentPassword: dto.currentPassword,
          newPassword: dto.newPassword,
        },
      });
    },
    onSuccess: () => {
      Toast.success(t("settings.success"));
      reset();
    },
    onError: (e) => {
      Toast.apiError(e);
    },
  });

  useEffect(() => {
    if (
      data?.user?.signUpMethod !== SignUpMethods.EMAIL &&
      status === "authenticated"
    ) {
      router.replace("/profile");
    }
  }, [data?.user?.signUpMethod, router, status]);

  useEffect(() => {
    if (confirmPassword) {
      trigger(["confirmPassword", "newPassword"]);
    }
  }, [newPassword, confirmPassword, trigger]);

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="font-bold text-slate-900">
          {t("settings.security.password.title")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {t("settings.security.password.description")}
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-md">
        <Controller
          control={control}
          name="currentPassword"
          rules={{
            required: t("errors.fieldRequired"),
            minLength: {
              value: 6,
              message: t("errors.minLength", {
                length: 6,
              }),
            },
            maxLength: {
              value: 64,
              message: t("errors.maxLength", {
                length: 64,
              }),
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("settings.security.password.current")}
              type="password"
              autoComplete="current-password"
              {...field}
              valid={!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          rules={{
            required: t("errors.fieldRequired"),
            minLength: {
              value: 6,
              message: t("errors.minLength", {
                length: 6,
              }),
            },
            maxLength: {
              value: 64,
              message: t("errors.maxLength", {
                length: 64,
              }),
            },
            validate: (value) =>
              value === confirmPassword ||
              t("settings.security.password.validation.mismatch"),
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("settings.security.password.new")}
              type="password"
              autoComplete="new-password"
              {...field}
              valid={!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: t("errors.fieldRequired"),
            minLength: {
              value: 6,
              message: t("errors.minLength", {
                length: 6,
              }),
            },
            maxLength: {
              value: 64,
              message: t("errors.maxLength", {
                length: 64,
              }),
            },
            validate: (value) =>
              value === newPassword ||
              t("settings.security.password.validation.mismatch"),
          }}
          render={({ field, fieldState: { error } }) => (
            <Input
              title={t("settings.security.password.confirm")}
              type="password"
              autoComplete="new-password"
              {...field}
              valid={!error}
              errorMessage={error?.message}
            />
          )}
        />

        <Button
          type="submit"
          disabled={mutation.isPending}
          loading={mutation.isPending}
          className="!bg-accent !text-white rounded-xl font-bold px-6 py-2.5 shadow-none hover:opacity-90"
          onClick={handleSubmit(() => mutation.mutate())}
        >
          {t("common.saveChanges")}
        </Button>
      </div>
    </section>
  );
}
