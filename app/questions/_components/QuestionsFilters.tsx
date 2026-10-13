"use client";

import { Button } from "@/app/components/Button";
import { Select } from "@/app/components/Select";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { faRotateBack } from "@fortawesome/free-solid-svg-icons/faRotateBack";
import { _Translator } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslations } from "use-intl";

const getPrivacyOptions = (t: _Translator) => [
  {
    label: t("addedToCommunity.all"),
    value: undefined,
  },
  {
    label: t("addedToCommunity.yes"),
    value: true,
  },
  {
    label: t("addedToCommunity.no"),
    value: false,
  },
];

const getSortOptions = (t: _Translator) => [
  {
    label: t("sort.default"),
    value: undefined,
  },
  {
    label: t("sort.newest"),
    value: GenericSortType.NEWEST,
  },
  {
    label: t("sort.oldest"),
    value: GenericSortType.OLDEST,
  },
];

export const QuestionsFilters: React.FC = () => {
  const t = useTranslations("questions.filters");
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

  const privacyOptions = getPrivacyOptions(t);
  const sortOptions = getSortOptions(t);

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
      <h3 className="font-bold text-text-primary px-2">{t("title")}</h3>

      <Select
        items={privacyOptions}
        value={
          privacyOptions.find((option) => option.value === isPublic)?.value
        }
        onChange={handlePublicFilterChange}
        title={t("addedToCommunity.title")}
      />

      <Select
        items={sortOptions}
        value={sortOptions.find((option) => option.value === sort)?.value}
        onChange={handleSortChange}
        title={t("sort.title")}
      />

      {isPublic !== undefined || sort !== undefined ? (
        <Button
          icon={faRotateBack}
          className="w-full text-xs"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          {t("clear")}
        </Button>
      ) : null}
    </div>
  );
};
