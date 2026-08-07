"use client";

import { Icon } from "@/app/components/Icon";
import { useGlobalContext } from "@/app/questions/context/global-context";
import { faInbox } from "@fortawesome/free-solid-svg-icons/faInbox";
import { Select } from "@/app/components/Select";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { Button } from "@/app/components/Button";

export default function MessagesCounter() {
  const {
    messages,
    messagesFilters: { sort, isStarred },
    setMessagesFilters,
  } = useGlobalContext();

  const shouldDisplayClearFilters = () => {
    if (isStarred !== undefined) {
      return true;
    }

    if (sort !== undefined) {
      return true;
    }

    return false;
  };

  return (
    <aside className="lg:col-span-4 space-y-6">
      <div className="bg-primary rounded-[2.5rem] p-8 text-secondary shadow-2xl relative overflow-hidden group">
        <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-accent rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>

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

      <div className="bg-surface border border-border rounded-[2.5rem] p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-text-primary px-2 text-sm">
          تصفية الرسائل
        </h3>

        <Select
          items={[
            { label: "جميع الرسائل", value: undefined },
            { label: "المميزة بنجمة", value: true },
            { label: "غير المميزة", value: false },
          ]}
          value={isStarred}
          onChange={(val) =>
            setMessagesFilters((prev) => ({ ...prev, isStarred: val }))
          }
          placeholder="اختر النوع"
        />

        <Select
          items={[
            { label: "الافتراضي", value: undefined },
            { label: "الأحدث أولاً", value: GenericSortType.NEWEST },
            { label: "الأقدم أولاً", value: GenericSortType.OLDEST },
          ]}
          value={sort}
          onChange={(val) =>
            setMessagesFilters((prev) => ({ ...prev, sort: val }))
          }
          placeholder="اختر الترتيب"
        />

        {shouldDisplayClearFilters() ? (
          <Button
            onClick={() => {
              setMessagesFilters((prev) => ({
                ...prev,
                isStarred: undefined,
                sort: undefined,
              }));
            }}
            className="w-full"
          >
            إلغاء التصفية
          </Button>
        ) : null}
      </div>
    </aside>
  );
}
