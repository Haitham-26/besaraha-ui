"use client";

import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/app/components/Spinner";
import { Empty } from "@/app/components/Empty";
import { NextClient } from "@/tools/NextClient";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import Message from "./Message";
import MessagesFilters from "./MessagesFilters";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { Message as MessageModel } from "@/model/message/types/Message";
import { Pagination } from "@/app/components/Pagination";
import { Icon } from "@/app/components/Icon";
import { faInbox } from "@fortawesome/free-solid-svg-icons/faInbox";
import { Button } from "@/app/components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { WarningModal } from "@/app/components/WarningModal";
import { Toast } from "@/tools/Toast";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { usePathname, useRouter } from "next/navigation";

type MessagesPageContentProps = {
  searchParams: URLSearchParams;
  normalizedParams: {
    sort: GenericSortType;
    isStarred?: boolean;
    page: number;
    limit: number;
  };
};

export function MessagesPageContent({
  searchParams,
  normalizedParams,
}: MessagesPageContentProps) {
  const [deleteAllModalVisible, setDeleteAllModalVisible] = useState(false);
  const [deleteAllLoading, setDeleteAllLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", normalizedParams],
    queryFn: async () => {
      const { data } = await NextClient<DataWithMeta<MessageModel>>(
        "/messages",
        {
          method: "GET",
          params: normalizedParams,
        },
      );
      return data;
    },
    staleTime: 0,
  });

  const handleDeleteAll = async () => {
    try {
      setDeleteAllLoading(true);

      await NextClient("/messages/delete-all", {
        method: "DELETE",
      });

      const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
        { key: "page", value: 1 },
      ]);

      router.push(updatedURL, { scroll: false });

      setDeleteAllModalVisible(false);
      Toast.success("تم حذف جميع الرسائل بنجاح");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setDeleteAllLoading(false);
    }
  };

  return (
    <main className="w-full bg-background pt-10 pb-7 lg:pb-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 px-6">
        <aside className="md:col-span-4 space-y-6">
          <div className="bg-primary rounded-[2.5rem] p-8 text-secondary shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-secondary/10 backdrop-blur-md rounded-2xl mb-6">
                <Icon icon={faInbox} className="text-accent text-2xl" />
              </div>
              <h1 className="text-4xl font-black mb-4 leading-tight">
                الرسائل الواردة
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-accent">
                  {messages?.meta?.total || 0}
                </span>
                <span className="text-secondary/40 text-sm font-bold tracking-widest uppercase">
                  رسالة واردة
                </span>
              </div>
            </div>
          </div>

          <MessagesFilters />
        </aside>

        <div className="md:col-span-8">
          <div className="bg-surface border border-border rounded-[3rem] shadow-sm min-h-[600px] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                الرسائل الأخيرة
              </h2>

              <Button
                onClick={() => setDeleteAllModalVisible(true)}
                className="!py-2 !px-4 !text-[10px] md:!text-xs !bg-danger/10 !text-danger hover:!bg-danger hover:!text-white shadow-none"
                icon={faTrash}
                loading={deleteAllLoading}
                disabled={!messages?.data?.length}
              >
                حذف الكل
              </Button>
            </div>

            <div className="flex-1 p-6 md:p-8">
              {messagesLoading ? (
                <Spinner className="text-accent static" />
              ) : null}

              {messages?.data?.length && !messagesLoading ? (
                <Fragment>
                  <div className="space-y-6 group/list">
                    {messages.data.map((message) => (
                      <Message
                        key={message._id}
                        message={message}
                        normalizedParams={normalizedParams}
                      />
                    ))}
                  </div>

                  <Pagination
                    meta={messages.meta}
                    pathname={"/messages"}
                    searchParams={searchParams}
                  />
                </Fragment>
              ) : null}

              {!messages?.data?.length && !messagesLoading ? (
                <Empty
                  title="لا توجد رسائل حالياً"
                  description="شارك الرابط الخاص بك مع الآخرين لاستقبال أول رسالة لك!"
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {messages?.data?.length ? (
        <WarningModal
          open={deleteAllModalVisible}
          onClose={() => setDeleteAllModalVisible(false)}
          onConfirm={handleDeleteAll}
          loading={deleteAllLoading}
          title="حذف جميع الرسائل"
          description="هل أنت متأكد؟ سيتم حذف جميع الرسائل الواردة نهائياً ولا يمكن التراجع عن هذا الإجراء."
        />
      ) : null}
    </main>
  );
}
