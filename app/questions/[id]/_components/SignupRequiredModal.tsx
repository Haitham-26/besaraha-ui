"use client";

import React from "react";
import { Question } from "@/model/question/Question";
import { Modal } from "@/app/components/Modal";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { Icon } from "@/app/components/Icon";
import { Button } from "@/app/components/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

type SignupRequiredModalProps = {
  question: Question;
};

export const SignupRequiredModal: React.FC<SignupRequiredModalProps> = ({
  question,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigaettWithRedirection = (path: string) => {
    localStorage.setItem("redirect", `/questions/${question._id}`);
    router.push(`/auth/${path}`);
  };

  return (
    <Modal
      title="انضم إلينا"
      open={searchParams.get("showRegisterModal") === "true"}
      onClose={() =>
        router.push(`/questions/${question._id}`, { scroll: false })
      }
    >
      <div className="flex flex-col items-center text-center">
        <div className="flex gap-4 mb-6">
          <div className="w-14 h-14 bg-accent/10 text-accent rounded-2xl flex items-center justify-center -rotate-12">
            <Icon icon={faHeart} className="text-2xl" />
          </div>
          <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center rotate-12">
            <Icon icon={faComments} className="text-2xl" />
          </div>
        </div>

        <h3 className="text-2xl font-black text-text-primary mb-3">
          تحتاج لتسجيل الدخول أولاً
        </h3>

        <p className="text-text-muted leading-relaxed mb-8">
          قم بإنشاء حساب أو تسجيل الدخول لتتمكن من الإعجاب بالردود على الأسئلة.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Button
            icon={faUserPlus}
            onClick={() => navigaettWithRedirection("signup")}
            className="w-full bg-accent text-white p-4"
          >
            إنشاء حساب جديد
          </Button>

          <Button
            onClick={() => navigaettWithRedirection("login")}
            className="w-full !bg-transparent font-bold !text-text-muted hover:!text-text-primary hover:!bg-surface-muted shadow-none"
          >
            لديك حساب بالفعل؟ تسجيل الدخول
          </Button>
        </div>

        <p className="mt-6 text-xs text-text-muted/60 font-medium">
          انضم لآلاف المستخدمين الذين يشاركون بصدق وأمان.
        </p>
      </div>
    </Modal>
  );
};
