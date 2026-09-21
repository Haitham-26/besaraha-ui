"use client";

import React, { Fragment, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LoginDto } from "@/model/auth/login/LoginDto";
import { Button } from "@/app/components/Button";
import { Toast } from "@/tools/Toast";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { AuthInput } from "../../../components/AuthInput";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export const LoginContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const t = useTranslations();
  const router = useRouter();
  const { control, handleSubmit, getValues } = useForm<LoginDto>({
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const dto = getValues();

      const res = await signIn("login", {
        redirect: false,
        identifier: dto.identifier,
        password: dto.password,
      });

      if (!res?.ok) {
        Toast.error(res?.error || t("errors.generic"));
      } else {
        Toast.success("login.success");
        router.push("/profile");
        router.refresh();
      }
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className="space-y-4">
        <Controller
          control={control}
          name="identifier"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title={t("login.identifier.title")}
              placeholder="name@example.com / abc123"
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

        <div className="flex flex-col gap-1 items-end">
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <AuthInput
                title={t("login.password.title")}
                placeholder="••••••••"
                value={value}
                onChange={onChange}
                valid={!error}
                errorMessage={error?.message}
                type="password"
                required
              />
            )}
          />

          <Link
            href={"/forgot-password/email"}
            className="text-accent font-bold text-xs ms-auto mt-2 inline-block"
          >
            {t("login.forgotPassword")}
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6">
        <Button
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          className="w-full h-14 rounded-2xl bg-accent text-white font-bold text-lg shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          icon={faArrowRightToBracket}
        >
          {t("login.button")}
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            {t("login.divider")}
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleLoginButton title={t("login.googleButton")} />

        <Link
          href="/signup"
          className="group text-center py-5 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
        >
          {t.rich("login.haveNoAccount", {
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
