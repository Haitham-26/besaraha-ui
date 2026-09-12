import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "./Button";
import Image from "next/image";
import { Toast } from "@/tools/Toast";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter as useLocaleRouter } from "@/i18n/navigation";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
};

export const GoogleLoginButton: React.FC<Props> = ({ title }) => {
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const currentPathname = usePathname();
  const localeRouter = useLocaleRouter();
  const router = useRouter();

  const onLoginWithGoogle = async () => {
    try {
      setLoading(true);

      const res = await signIn("google");

      if (res?.ok) {
        router.replace("/profile");
        router.refresh();
      }
    } catch (e) {
      console.error("Login error:", e);
      Toast.apiError(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    const errorMessage = searchParams.get("authError");

    if (errorMessage) {
      Toast.error(errorMessage);
      localeRouter.replace(currentPathname);
    }
  }, [searchParams, currentPathname, localeRouter]);

  return (
    <Button
      onClick={onLoginWithGoogle}
      loading={loading}
      className="w-full !h-14 !bg-white !text-primary !font-black !text-sm hover:!bg-slate-100 flex items-center justify-center gap-3 active:scale-95 shadow-none"
    >
      <span>{title}</span>

      <Image src={"/images/google.svg"} width={20} height={20} alt="Google" />
    </Button>
  );
};
