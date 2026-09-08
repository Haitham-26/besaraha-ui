"use client";

import { Message as MessageModel } from "@/model/message/types/Message";
import { formattedDate } from "@/tools/Date";
import { Icon } from "@/app/components/Icon";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons/faUserSecret";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons/faEllipsisVertical";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/app/components/Button";
import { Dropdown } from "@/app/components/Dropdown";
import { WarningModal } from "@/app/components/WarningModal";
import { Toast } from "@/tools/Toast";
import { NextClient } from "@/tools/NextClient";
import { faStar } from "@fortawesome/free-solid-svg-icons/faStar";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  message: MessageModel;
  normalizedParams: {
    sort: GenericSortType;
    isStarred?: boolean;
    page: number;
    limit: number;
  };
};

export default function Message({ message, normalizedParams }: Props) {
  const isAnonymous = !message.name;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [isStarred, setIsStarred] = useState(message?.isStarred);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const textRef = useRef<HTMLParagraphElement>(null);

  const cachedMessages = queryClient.getQueryData([
    "messages",
    normalizedParams,
  ]) as DataWithMeta<MessageModel>;

  const navigateToPreviousPageIfNeeded = (isDelete?: boolean) => {
    const isOnFirstPage = normalizedParams.page === 1;
    const isIsStarredFilterApplied = normalizedParams.isStarred !== undefined;

    if (isOnFirstPage || (!isDelete && !isIsStarredFilterApplied)) {
      return;
    }

    const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
      { key: "page", value: normalizedParams.page - 1 },
    ]);

    if (cachedMessages.data.length === 1) {
      router.replace(updatedURL, { scroll: false });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: () =>
      NextClient("/messages/delete", {
        method: "DELETE",
        data: { messageId: message._id },
      }),

    onSuccess: async () => {
      navigateToPreviousPageIfNeeded();

      await queryClient.invalidateQueries({
        queryKey: ["messages", normalizedParams],
      });

      setDeleteModalVisible(false);

      Toast.success("تم حذف الرسالة بنجاح");
    },

    onError: (e) => {
      console.log(e);
      Toast.apiError(e);
    },
  });

  const toggleStarMutation = useMutation({
    mutationFn: () =>
      NextClient("/messages/toggle-star", {
        method: "PATCH",
        data: {
          messageId: message._id,
          isStarred: !message.isStarred,
        },
      }),

    onMutate: () => {
      setIsStarred((prev) => !prev);
    },

    onSuccess: async () => {
      navigateToPreviousPageIfNeeded();

      await queryClient.invalidateQueries({
        queryKey: ["messages", normalizedParams],
      });

      Toast.success(
        message.isStarred ? "تم إلغاء تمييز الرسالة" : "تم تمييز الرسالة بنجاح",
      );
    },

    onError: (e) => {
      setIsStarred((prev) => !prev);

      console.log(e);
      Toast.apiError(e);
    },
  });

  useEffect(() => {
    if (textRef.current) {
      const height = textRef.current.scrollHeight;

      if (height > 70) {
        setIsCollapsible(true);
      }
    }
  }, [message.message]);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="absolute inset-0 bg-accent/5 rounded-2xl md:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-surface border border-border rounded-2xl md:rounded-3xl transition-all duration-300 hover:border-accent/20 shadow-sm hover:shadow-md">
        <div className="flex flex-wrap items-start justify-between px-4 py-3 border-b border-border bg-surface-muted/30 gap-y-3">
          <div className="flex items-center gap-2.5 min-w-0 max-w-full">
            <div
              className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-sm ${
                isAnonymous
                  ? "bg-white text-text-muted border border-border"
                  : "bg-accent text-white"
              }`}
            >
              <Icon icon={isAnonymous ? faUserSecret : faCircleUser} />
            </div>
            <span className="font-black text-xs md:text-sm text-text-primary break-words leading-tight">
              {message.name}
            </span>
          </div>

          <div className="flex items-center gap-1 md:gap-3 flex-shrink-0 ms-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-text-muted opacity-80 whitespace-nowrap">
              <Icon icon={faCalendar} className="text-[9px]" />
              <span className="dir-ltr">
                {formattedDate(message.createdAt, true)}
              </span>
            </div>

            <Dropdown
              items={[
                {
                  title: "حذف الرسالة",
                  icon: faTrash,
                  className: "text-danger hover:!bg-danger/5",
                  onClick: () => setDeleteModalVisible(true),
                },
              ]}
            >
              <Button
                icon={faEllipsisVertical}
                className="!w-8 !h-8 aspect-square rounded-full !bg-transparent hover:!bg-border/50 !text-text-muted shadow-none !p-3"
              />
            </Dropdown>

            <Button
              onClick={() => toggleStarMutation.mutate()}
              disabled={toggleStarMutation.isPending}
              className={`!w-fit !p-0 !bg-transparent shadow-none border-none ${
                isStarred
                  ? "!text-amber-500 scale-110"
                  : "!text-text-muted/40 hover:!text-amber-400"
              }`}
            >
              <Icon
                icon={faStar}
                className={`text-sm ${isStarred ? "drop-shadow-[0_0_5px_rgba(245,158,11,0.4)]" : ""}`}
              />
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <div
            className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
              isCollapsible && !isExpanded ? "max-h-16" : "max-h-[1000px]"
            }`}
          >
            <p
              ref={textRef}
              className="text-sm md:text-base text-text-primary leading-relaxed font-medium whitespace-pre-wrap [word-break:break-word]"
            >
              {message.message}
            </p>

            {isCollapsible && !isExpanded ? (
              <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-surface to-transparent" />
            ) : null}
          </div>

          {isCollapsible ? (
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 flex items-center gap-1.5 text-[11px] font-black !text-accent hover:opacity-80 transition-all uppercase tracking-tighter !p-2 !bg-transparent shadow-none"
            >
              <span>{isExpanded ? "عرض أقل" : "إظهار الرسالة كاملة"}</span>
              <Icon
                icon={isExpanded ? faChevronUp : faChevronDown}
                className="text-[9px]"
              />
            </Button>
          ) : null}
        </div>
      </div>

      <WarningModal
        title="حذف الرسالة"
        description="بمجرد حذف الرسالة لا يمكن استرجاعها لاحقًا."
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => deleteMutation.mutate()}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
