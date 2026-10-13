"use client";

import { useState } from "react";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";

import { Button } from "@/app/components/Button";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { OTPInput } from "@/app/components/OTPInput";
import { Controller, useForm } from "react-hook-form";
import { ResendTokenButton } from "@/app/components/ResendTokenButton";
import { Icon } from "@/app/components/Icon";
import { SignUpVerifyTokenDto } from "@/model/auth/signup/SignUpVerifyTokenDto";
import { AppLangs } from "@/model/shared/types/AppLangs.enum";
import { signIn } from "next-auth/react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const TOKEN_LENGTH = 6;

type SignUpTokenContentProps = {
  email: string;
};

export const SignUpTokenContent: React.FC<SignUpTokenContentProps> = ({
  email,
}) => {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, getValues, reset, watch } =
    useForm<SignUpVerifyTokenDto>({
      defaultValues: {
        token: "",
        email,
        lang: locale as AppLangs,
      },
    });

  const token = watch("token");

  const LOCAL_STORAGE_RESEND_KEY = `signup-verification-${email}`;

  const onSubmit = async () => {
    try {
      setLoading(true);

      const res = await signIn("signup-token", {
        redirect: false,
        ...getValues(),
      });

      if (!res?.ok) {
        Toast.error(res?.error || t("errors.generic"));
      } else {
        Toast.success(t("signupToken.success"));

        reset();

        localStorage.removeItem(LOCAL_STORAGE_RESEND_KEY);

        router.replace("/profile");
        router.refresh();
      }
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
        lang: locale,
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
          {t("signupToken.subtitle")}
        </h2>

        <p className="mt-4 text-text-muted leading-7">
          {t.rich("signupToken.description", {
            email,
            tokenLength: TOKEN_LENGTH,
            span: (chunk) => (
              <span className="text-white/80 font-bold">{chunk}</span>
            ),
          })}
        </p>
      </div>

      <div className="mt-10 w-full">
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
          localStorageKey={LOCAL_STORAGE_RESEND_KEY}
          onResend={resend}
        />
      </div>

      <Button
        loading={loading}
        disabled={!token || token.length !== TOKEN_LENGTH}
        onClick={handleSubmit(onSubmit)}
        className="mt-6 w-full"
      >
        {t("signupToken.button")}
      </Button>

      <Link
        href="/signup"
        className="mt-8 text-sm font-semibold text-text-muted hover:text-white transition-colors"
      >
        {t("signupToken.changeEmail")}
      </Link>
    </div>
  );
};
