"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { LoginDto } from "@/model/auth/login/LoginDto";
import { Button } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { Toast } from "@/tools/Toast";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons/faArrowRightToBracket";
import { NextClient } from "@/tools/NextClient";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { AuthInput } from "../../_components/AuthInput";

export const LoginContent: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, getValues } = useForm<LoginDto>({
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async () => {
    try {
      setLoading(true);
      const dto = getValues();

      await NextClient("/auth/login", {
        method: "POST",
        data: dto,
        withCredentials: true,
      });

      Toast.success("تم تسجيل دخولك بنجاح");

      router.replace("/questions");
      router.refresh();
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
              title="البريد الإلكتروني أو اسم المستخدم"
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
                title="كلمة المرور"
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
            href={"/auth/forgot-password/email"}
            className="text-accent font-bold text-xs ms-auto mt-2 inline-block"
          >
            نسيت كلمة السر؟
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
          تسجيل الدخول
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            أو المتابعة عبر
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleLoginButton title="تسجيل دخول باستخدام جوجل" />

        <Link
          href="/auth/signup"
          className="group text-center py-5 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
        >
          <span className="text-slate-400 font-medium">ليس لديك حساب؟ </span>
          <span className="text-accent font-black group-hover:underline decoration-accent decoration-2 underline-offset-4">
            أنشئ حساباً الآن
          </span>
        </Link>
      </div>
    </Fragment>
  );
};
