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

const markPrivateModalDescription =
  "سيتم إزالة هذا السؤال من صفحة الأسئلة العامة، وسيظهر فقط لمن يملك رابطه. هل تريد المتابعة؟";

const markPublicModalDescription =
  "سيتم عرض هذا السؤال في صفحة الأسئلة العامة. هل تريد المتابعة؟";

type QuestionActionsProps = {
  question: Question;
  setPage?: (newPage: number) => void;
};

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
  setPage,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [togglePrivacyModalVisible, setTogglePrivacyModalVisible] =
    useState(false);

  const queryClient = useQueryClient();

  // if there is only one page, we want to go back to the previous page
  // for toggle privacy and delete
  const goToFirstPage = () => {
    if (!setPage) {
      return;
    }

    setPage(1);
  };

  const togglePrivacyMutation = useMutation({
    mutationFn: async () => {
      await NextClient(`/questions/${question._id}/toggle-privacy`, {
        method: "PATCH",
        data: { isPublic: !question.isPublic },
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
      goToFirstPage();

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

  return (
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
  );
};
