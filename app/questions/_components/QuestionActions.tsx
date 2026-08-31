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

const markPrivateModalDescription =
  "سيتم إزالة هذا السؤال من صفحة الأسئلة العامة، وسيظهر فقط لمن يملك رابطه. هل تريد المتابعة؟";

const markPublicModalDescription =
  "سيتم عرض هذا السؤال في صفحة الأسئلة العامة. هل تريد المتابعة؟";

type QuestionActionsProps = {
  question: Question;
  isLast?: boolean;
};

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
  isLast,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [togglePrivacyModalVisible, setTogglePrivacyModalVisible] =
    useState(false);

  const { data } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = data?.user?._id;

  const isOnProfilePage = !Boolean(pathname.replace("/questions", "").length);

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

  const isOwner = userId && userId === question.userId;

  // if there is only one page, we want to go back to the previous page
  // for toggle privacy and delete
  const goToFirstPage = (isDelete?: boolean) => {
    const numericPage = Number(searchParams.get("page") || 1);

    const isOnFirstPage = numericPage === 1;
    const isPrivacyFilterApplied = searchParams.get("isPublic") !== "undefined";

    if ((isPrivacyFilterApplied || isDelete) && isLast && !isOnFirstPage) {
      const prevPage = numericPage - 1;

      const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
        { key: "page", value: prevPage },
      ]);

      router.replace(updatedURL);
    }
  };

  const togglePrivacyMutation = useMutation({
    mutationFn: async () => {
      await NextClient(`/questions/${question._id}/toggle-privacy`, {
        method: "PATCH",
      });
    },

    onSuccess: async () => {
      goToFirstPage();

      await queryClient.invalidateQueries({
        queryKey: ["questions", "user"],
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
      goToFirstPage(true);

      await queryClient.invalidateQueries({
        queryKey: ["questions", "user"],
      });

      setDeleteModalVisible(false);

      Toast.success("تم حذف السؤال بنجاح");
    },

    onError: (error) => {
      Toast.apiError(error);
    },
  });

  const togglePrivacy = () => {
    togglePrivacyMutation.mutate();
  };

  const onDelete = () => {
    deleteMutation.mutate();
  };

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

      {isOnProfilePage && isOwner ? (
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
            onConfirm={onDelete}
            loading={deleteMutation.isPending}
            title={`حذف السؤال "${question.question}"`}
          />

          <WarningModal
            open={togglePrivacyModalVisible}
            onClose={() => setTogglePrivacyModalVisible(false)}
            onConfirm={togglePrivacy}
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
