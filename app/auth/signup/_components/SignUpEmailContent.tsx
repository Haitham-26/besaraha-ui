"use client";

import React, { Fragment, useState } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/app/components/Button";
import { SignUpDto } from "@/model/auth/signup/SignUpDto";
import { Toast } from "@/tools/Toast";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";

import { Icon } from "@/app/components/Icon";
import { NextClient } from "@/tools/NextClient";
import { GoogleLoginButton } from "@/app/components/GoogleLoginButton";
import { useRouter } from "next/navigation";
import { AuthInput } from "../../_components/AuthInput";

export const SignUpEmailContent: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { control, handleSubmit, getValues, reset } = useForm<SignUpDto>({
    defaultValues: { username: "", name: "", email: "", password: "" },
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
          rules={{ required: "اسم المستخدم مطلوب" }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title="اسم المستخدم"
              placeholder="مثال: ahmad_mohamad"
              value={value}
              onChange={(e) => {
                onChange(e.currentTarget.value.toLowerCase());
              }}
              valid={!error}
              errorMessage={error?.message}
              required
            />
          )}
        />

        <Controller
          control={control}
          name="name"
          rules={{ required: "الاسم الكامل مطلوب" }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title="الاسم الكامل"
              placeholder="مثال: أحمد محمد"
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
          rules={{ required: "البريد الإلكتروني مطلوب" }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title="البريد الإلكتروني"
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
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <AuthInput
              title="كلمة المرور"
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
          className="w-full h-14 rounded-2xl bg-accent text-white font-bold text-lg shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <span>إنشاء حساب جديد</span>
          <Icon icon={faUserPlus} className="text-sm" />
        </Button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
            أو المتابعة عبر
          </span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <GoogleLoginButton title="تسجيل باستخدام جوجل" />

        <Link
          href="/auth/login"
          className="group text-center py-5 px-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
        >
          <span className="text-slate-400 font-medium">لديك حساب بالفعل؟ </span>
          <span className="text-accent font-black group-hover:underline decoration-accent decoration-2 underline-offset-4">
            تسجيل الدخول
          </span>
        </Link>
      </div>
    </Fragment>
  );
};
