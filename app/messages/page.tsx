"use client";

import MessagesList from "./_components/MessagesList";
import MessagesCounter from "./_components/MessagesCounter";
import DeleteAllMessages from "./_components/DeleteAllMessages";
import { useGlobalContext } from "../questions/context/global-context";
import { useMemo } from "react";
import { Pagination } from "../components/Pagination";

export default function Page() {
  const {
    setMessagesLoading,
    setMessages,
    messagesFilters: { isStarred, sort },
  } = useGlobalContext();

  const paginationAction = useMemo(
    () => ({
      endpoint: "/message/messages",
      method: "GET" as const,
      data: { isStarred, sort },
    }),
    [isStarred, sort],
  );

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
              <MessagesList />

              <Pagination
                setData={setMessages}
                setLoading={setMessagesLoading}
                action={paginationAction}
                limit={10}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
