"use client";

import React, { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/app/components/Button";
import { SignUpEmailDto } from "@/model/auth/signup/SignUpEmailDto";
import { Toast } from "@/tools/Toast";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";

import { NextClient } from "@/tools/NextClient";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { AuthInput } from "../../../components/AuthInput";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const MAX_USERNAME_LENGTH = 20;

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 30;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

export const SignUpEmailContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const t = useTranslations();
  const router = useRouter();
  const { control, handleSubmit, getValues, reset } = useForm<SignUpEmailDto>({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await NextClient("/auth/signup/email", {
        method: "POST",
        data: dto,
        withCredentials: true,
      });

      reset();

      router.push(`/auth/signup/token?email=${dto.email}`);
    } catch (e: any) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="username"
          rules={{
            required: t("errors.fieldRequired"),
            maxLength: {
              value: MAX_USERNAME_LENGTH,
              message: t("errors.maxLength", { length: MAX_USERNAME_LENGTH }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title={t("signup.username.title")}
              placeholder={t("signup.username.placeholder")}
              value={value}
              onChange={(e) => {
                onChange(e.currentTarget.value.toLowerCase());
              }}
              valid={!error}
              errorMessage={error?.message}
              required
              dir="ltr"
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{
            required: t("errors.fieldRequired"),
            minLength: {
              value: MIN_NAME_LENGTH,
              message: t("errors.minLength", { length: MIN_NAME_LENGTH }),
            },
            maxLength: {
              value: MAX_NAME_LENGTH,
              message: t("errors.maxLength", { length: MAX_NAME_LENGTH }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title={t("signup.name.title")}
              placeholder={t("signup.name.placeholder")}
              value={value}
              onChange={onChange}
              valid={!error}
              errorMessage={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          rules={{ required: t("errors.fieldRequired") }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title={t("signup.email.title")}
              placeholder="name@example.com"
              value={value}
              onChange={(e) => {
                onChange(e.currentTarget.value.toLowerCase());
              }}
              valid={!error}
              errorMessage={error?.message}
              type="email"
              required
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: t("errors.fieldRequired"),
            minLength: {
              value: MIN_PASSWORD_LENGTH,
              message: t("errors.minLength", { length: MIN_PASSWORD_LENGTH }),
            },
            maxLength: {
              value: MAX_PASSWORD_LENGTH,
              message: t("errors.maxLength", { length: MAX_PASSWORD_LENGTH }),
            },
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title={t("signup.password.title")}
              placeholder="••••••••"
              value={value}
              onChange={onChange}
              valid={!error}
              errorMessage={error?.message}
              required
              type="password"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          icon={faUserPlus}
        >
          {t("signup.button")}
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            {t("signup.divider")}
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleLoginButton title={t("signup.googleButton")} />

        <Link
          href="/login"
          className="group text-center py-5 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
        >
          {t.rich("signup.alreadyHaveAccount", {
            text: (chunks) => (
              <span className="text-slate-400 font-medium">{chunks}</span>
            ),
            link: (chunks) => (
              <span className="text-accent font-black group-hover:underline decoration-accent decoration-2 underline-offset-4">
                {chunks}
              </span>
            ),
          })}
        </Link>
      </div>
    </Fragment>
  );
};
