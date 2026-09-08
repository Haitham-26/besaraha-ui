"use client";

import React, { Fragment, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Question } from "@/model/question/Question";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { Dropdown, DropdownItem } from "@/app/components/Dropdown";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { Button } from "@/app/components/Button";
import { WarningModal } from "@/app/components/WarningModal";
import { faShareNodes } from "@fortawesome/free-solid-svg-icons/faShareNodes";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";

const markPrivateModalDescription =
  "سيتم إزالة هذا السؤال من صفحة الأسئلة العامة، وسيظهر فقط لمن يملك رابطه. هل تريد المتابعة؟";

const markPublicModalDescription =
  "سيتم عرض هذا السؤال في صفحة الأسئلة العامة. هل تريد المتابعة؟";

type QuestionActionsProps = {
  question: Question;
  normalizedParams: {
    page: number;
    limit: number;
    isPublic?: boolean;
  } | null;
};

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
  normalizedParams,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [togglePrivacyModalVisible, setTogglePrivacyModalVisible] =
    useState(false);

  const { data } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const cachedQuestions = queryClient.getQueryData([
    "questions",
    "user",
    normalizedParams,
  ]) as DataWithMeta<Question>;

  const userId = data?.user?._id;

  const isOnPrivateQuestionsPage = !Boolean(
    pathname.replace("/questions", "").length,
  );
  const isOwner = userId && userId === question.userId;

  const dropdownItems: DropdownItem[] = [
    {
      title: question.isPublic ? "اجعله خاص" : "اجعله عام",
      icon: question.isPublic ? faLock : faEarthAmericas,
      onClick: () => setTogglePrivacyModalVisible(true),
    },
    {
      title: "حذف السؤال",
      icon: faTrash,
      className: "!text-danger",
      onClick: () => setDeleteModalVisible(true),
    },
  ];

  const navigateToPreviousPageIfNeeded = (isDelete?: boolean) => {
    if (!normalizedParams) {
      return;
    }

    const isOnFirstPage = normalizedParams.page === 1;
    const isIsPrivacyFilterApplied = normalizedParams.isPublic !== undefined;

    if (
      isOnFirstPage ||
      !isOnPrivateQuestionsPage ||
      (!isDelete && !isIsPrivacyFilterApplied)
    ) {
      return;
    }

    const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
      { key: "page", value: normalizedParams.page - 1 },
    ]);

    if (cachedQuestions.data.length === 1) {
      router.replace(updatedURL, { scroll: false });
    }
  };

  const togglePrivacyMutation = useMutation({
    mutationFn: async () => {
      await NextClient(`/questions/${question._id}/toggle-privacy`, {
        method: "PATCH",
      });
    },

    onSuccess: async () => {
      navigateToPreviousPageIfNeeded();

      await queryClient.invalidateQueries({
        queryKey: ["questions", "user", normalizedParams],
      });

      setTogglePrivacyModalVisible(false);

      Toast.success(
        question.isPublic ? "تم جعل السؤال خاصاً" : "تم جعل السؤال عاماً",
      );
    },

    onError: (e) => {
      Toast.apiError(e);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await NextClient(`/questions/${question._id}/delete`, {
        method: "DELETE",
      });
    },

    onSuccess: async () => {
      navigateToPreviousPageIfNeeded(true);

      await queryClient.invalidateQueries({
        queryKey: ["questions", "user", normalizedParams],
      });

      setDeleteModalVisible(false);

      Toast.success("تم حذف السؤال بنجاح");
    },

    onError: (error) => {
      Toast.apiError(error);
    },
  });

  const onShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/questions/${question._id}`,
    );

    Toast.success("تم نسخ الرابط بنجاح");
  };

  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
      <Button
        onClick={onShare}
        icon={faShareNodes}
        className="text-xs bg-surface-muted shadow-none font-bold !text-text-muted hover:bg-surface-muted"
      >
        مشاركة
      </Button>

      {isOnPrivateQuestionsPage && isOwner ? (
        <Fragment>
          <Dropdown items={dropdownItems}>
            <Button
              icon={faEllipsisVertical}
              className="!w-8 !h-8 aspect-square rounded-full !bg-transparent hover:!bg-border/50 !text-text-muted shadow-none !p-3"
            />
          </Dropdown>

          <WarningModal
            open={deleteModalVisible}
            onClose={() => setDeleteModalVisible(false)}
            onConfirm={() => deleteMutation.mutate()}
            loading={deleteMutation.isPending}
            title={`حذف السؤال "${question.question}"`}
          />

          <WarningModal
            open={togglePrivacyModalVisible}
            onClose={() => setTogglePrivacyModalVisible(false)}
            onConfirm={() => togglePrivacyMutation.mutate()}
            loading={togglePrivacyMutation.isPending}
            title="تغيير خصوصية السؤال"
            description={
              question.isPublic
                ? markPrivateModalDescription
                : markPublicModalDescription
            }
          />
        </Fragment>
      ) : null}
    </div>
  );
};
