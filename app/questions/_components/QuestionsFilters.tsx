"use client";

import { Button } from "@/app/components/Button";
import { Select } from "@/app/components/Select";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { faRotateBack } from "@fortawesome/free-solid-svg-icons/faRotateBack";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const privacyOptions = [
  {
    label: "كل الأنواع",
    value: undefined,
  },
  {
    label: "خاص",
    value: false,
  },
  {
    label: "عام",
    value: true,
  },
];

const sortOptions = [
  {
    label: "الافتراضي",
    value: undefined,
  },
  {
    label: "الأحدث أولاً",
    value: GenericSortType.NEWEST,
  },
  {
    label: "الأقدم أولاً",
    value: GenericSortType.OLDEST,
  },
];

export const QuestionsFilters: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicParam = searchParams.get("isPublic");

  const getIsPublic = () => {
    switch (isPublicParam) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return undefined;
    }
  };

  const isPublic = getIsPublic();
  const sort =
    searchParams.get("sort") || (undefined as GenericSortType | undefined);

  const handlePublicFilterChange = (value?: boolean) => {
    const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
      { key: "isPublic", value },
      { key: "page", value: 1 },
    ]);

    router.push(updatedURL, { scroll: false });
  };

  const handleSortChange = (value?: GenericSortType) => {
    const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
      { key: "sort", value },
      { key: "page", value: 1 },
    ]);

    router.push(updatedURL, { scroll: false });
  };

  return (
    <div className="bg-surface border border-border rounded-[2.5rem] p-6 space-y-4 shadow-sm">
      <h3 className="font-bold text-text-primary px-2">نتائج الأسئلة</h3>

      <Select
        items={privacyOptions}
        value={
          privacyOptions.find((option) => option.value === isPublic)?.value
        }
        onChange={handlePublicFilterChange}
        placeholder="اختر النوع"
      />

      <Select
        items={sortOptions}
        value={sortOptions.find((option) => option.value === sort)?.value}
        onChange={handleSortChange}
        placeholder="اختر الترتيب"
      />

      {isPublic !== undefined || sort !== undefined ? (
        <Button
          icon={faRotateBack}
          className="w-full"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          إلغاء الفلاتر
        </Button>
      ) : null}
    </div>
  );
};
