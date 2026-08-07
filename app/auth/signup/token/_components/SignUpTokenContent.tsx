"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";
import Link from "next/link";

import { Button } from "@/app/components/Button";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { OTPInput } from "@/app/components/OTPInput";
import { Controller, useForm } from "react-hook-form";
import { ResendTokenButton } from "@/app/components/ResendTokenButton";
import { Icon } from "@/app/components/Icon";
import { SignUpVerifyTokenDto } from "@/model/auth/signup/SignUpVerifyTokenDto";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";

type SignUpTokenContentProps = {
  email: string;
};

export const SignUpTokenContent: React.FC<SignUpTokenContentProps> = ({
  email,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, getValues, reset } =
    useForm<SignUpVerifyTokenDto>({
      defaultValues: {
        token: "",
        email,
        lang: document.documentElement.lang as AppLangs,
      },
    });

  const LOCAL_STORAGE_RESEND_KEY = `signup-verification-${email}`;

  const onSubmit = async () => {
    try {
      setLoading(true);

      await NextClient("/auth/signup/token", {
        method: "POST",
        data: getValues(),
        withCredentials: true,
      });

      Toast.success("تم تفعيل حسابك بنجاح");

      reset();

      localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY);

      router.replace("/");
      router.refresh();
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await NextClient("/auth/signup/token-send", {
      method: "POST",
      data: {
        email,
        lang: document.documentElement.lang as AppLangs,
      },
      withCredentials: true,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
        <Icon icon={faEnvelopeOpenText} className="text-accent text-5xl" />
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-3xl font-black text-white">
          تحقق من بريدك الإلكتروني
        </h2>

        <p className="mt-4 text-text-muted leading-7">
          <span>أرسلنا رمز تحقق مكونًا من 6 خانات إلى</span>
          <strong className="text-white/80"> {email}</strong>
        </p>
      </div>

      <div className="mt-10 w-full">
        <Controller
          control={control}
          name="token"
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <OTPInput value={value} onChange={onChange} length={6} />
          )}
        />

        <ResendTokenButton
          localStorageKey={LOCAL_STORAGE_RESEND_KEY}
          onResend={resend}
        />
      </div>

      <Button
        loading={loading}
        onClick={handleSubmit(onSubmit)}
        className="mt-10 w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-accent/20"
      >
        تفعيل الحساب
      </Button>

      <Link
        href="/auth/signup"
        className="mt-8 text-sm font-semibold text-text-muted hover:text-white transition-colors"
      >
        تغيير البريد الإلكتروني
      </Link>
    </div>
  );
};
