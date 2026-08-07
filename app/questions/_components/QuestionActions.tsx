"use client";

import React, { Fragment, useState } from "react";
import { Question } from "@/model/question/Question";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { Dropdown, DropdownItem } from "@/app/components/Dropdown";
import { NextClient } from "@/tools/NextClient";
import { Toast } from "@/tools/Toast";
import { useGlobalContext } from "../context/global-context";
import { Button } from "@/app/components/Button";
import { WarningModal } from "@/app/components/WarningModal";

const markPrivateModalDescription =
  "سيتم إزالة هذا السؤال من صفحة الأسئلة العامة، وسيظهر فقط لمن يملك رابطه. هل تريد المتابعة؟";
const markPublicModalDescription =
  "سيتم عرض هذا السؤال في صفحة الأسئلة العامة. هل تريد المتابعة؟";

type QuestionActionsProps = {
  question: Question;
};

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
}) => {
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [togglePrivacyModalVisible, setTogglePrivacyModalVisible] =
    useState(false);
  const {
    setQuestions,
    globalMeta,
    questionsFilters: { isPublic, sort },
  } = useGlobalContext();

  const togglePrivacy = async () => {
    try {
      setLoading(true);

      const newStatus = !question.isPublic;

      await NextClient(`/questions/${question._id}/toggle-privacy`, {
        method: "PATCH",
        data: { isPublic: newStatus },
      });

      const { data } = await NextClient("/questions", {
        method: "POST",
        data: {
          userId: question.userId,
          page: globalMeta.page,
          limit: 5,
          isPublic,
          sort,
        },
      });

      setQuestions(data as any);

      setTogglePrivacyModalVisible(false);

      Toast.success(newStatus ? "تم جعل السؤال عاماً" : "تم جعل السؤال خاصاً");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await NextClient(`/questions/${question._id}/delete`, {
        method: "DELETE",
      });

      const currentPage = globalMeta?.page || 1;
      const limit = globalMeta?.limit || 10;
      const total = (globalMeta?.total || 1) - 1;

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      const { data } = await NextClient("/questions", {
        method: "POST",
        data: {
          userId: question.userId,
          page: newPage,
          limit: 5,
          isPublic,
          sort,
        },
      });

      setQuestions(data as any);

      setDeleteModalVisible(false);

      Toast.success("تم حذف السؤال بنجاح");
    } catch (e: any) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
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
        loading={loading}
        title={`حذف السؤال "${question.question}"`}
      />

      <WarningModal
        open={togglePrivacyModalVisible}
        onClose={() => setTogglePrivacyModalVisible(false)}
        onConfirm={togglePrivacy}
        loading={loading}
        title={"تغيير خصوصية السؤال"}
        description={
          question.isPublic
            ? markPrivateModalDescription
            : markPublicModalDescription
        }
      />
    </Fragment>
  );
};
