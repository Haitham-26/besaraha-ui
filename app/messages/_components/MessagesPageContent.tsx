"use client";

import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/app/components/Spinner";
import { Empty } from "@/app/components/Empty";
import { NextClient } from "@/tools/NextClient";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import Message from "./Message";
import DeleteAllMessages from "./DeleteAllMessages";
import MessagesCounter from "./MessagesCounter";
import { DataWithMeta } from "@/model/shared/types/DataWithMeta";
import { Message as MessageModel } from "@/model/message/types/Message";
import { Pagination } from "@/app/components/Pagination";

const MESSAGES_LIMIT = 10;

export function MessagesPageContent({
  limit = MESSAGES_LIMIT,
}: {
  limit?: number;
}) {
  const page = 1;

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["messages", { page, limit }],
    queryFn: async () => {
      const { data } = await NextClient<DataWithMeta<MessageModel>>(
        "/messages",
        {
          method: "GET",
          params: { page, limit, sort: GenericSortType.NEWEST },
        },
      );
      return data;
    },
  });

  return (
    <div className="w-full bg-surface-muted p-4 pt-6 md:p-8 lg:p-12 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <MessagesCounter />

        <div className="lg:col-span-8">
          <div className="bg-surface border border-border rounded-[3rem] shadow-sm min-h-[600px] flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-white/50 backdrop-blur-sm">
              <h2 className="font-bold text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                الرسائل الأخيرة
              </h2>

              <DeleteAllMessages />
            </div>

            <div className="flex-1 p-6 md:p-8">
              {messagesLoading ? (
                <Spinner className="text-accent static" />
              ) : !messages?.data?.length ? (
                <Empty
                  title="لا توجد رسائل حالياً"
                  description="شارك الرابط الخاص بك مع الآخرين لاستقبال أول رسالة لك!"
                />
              ) : (
                <Fragment>
                  <div className="space-y-6 group/list">
                    {messages.data.map((message) => (
                      <div
                        key={message._id}
                        className="transition-all duration-500 hover:!blur-none group-hover/list:blur-[2px] group-hover/list:opacity-50 hover:!opacity-100"
                      >
                        <Message message={message} />
                      </div>
                    ))}
                  </div>

                  <Pagination meta={messages.meta} pathname={"/messages"} />
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
