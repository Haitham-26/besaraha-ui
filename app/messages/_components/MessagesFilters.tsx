"use client";

import { Select } from "@/app/components/Select";
import { GenericSortType } from "@/model/shared/dto/GenericSortType";
import { Button } from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { getUpdatedURLQuery } from "@/tools/getUpdatedURLQuery";
import { faRotateBack } from "@fortawesome/free-solid-svg-icons/faRotateBack";
import { useTranslations } from "next-intl";

export default function MessagesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations("messages.filters");

  const isStarredParam = searchParams.get("isStarred");

  const getIsStarred = () => {
    switch (isStarredParam) {
      case "true":
        return true;
      case "false":
        return false;
      default:
        return undefined;
    }
  };

  const isStarred = getIsStarred();
  const sort =
    searchParams.get("sort") || (undefined as GenericSortType | undefined);

  const handleStarredFilterChange = (value?: boolean) => {
    const updatedURL = getUpdatedURLQuery(searchParams, pathname, [
      { key: "isStarred", value },
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
      <h3 className="font-bold text-text-primary px-2 text-sm">{t("title")}</h3>

      <Select
        title={t("star.title")}
        items={[
          { label: t("star.all"), value: undefined },
          { label: t("star.starred"), value: true },
          { label: t("star.unstarred"), value: false },
        ]}
        value={isStarred}
        onChange={handleStarredFilterChange}
      />

      <Select
        title={t("sort.title")}
        items={[
          { label: t("sort.default"), value: undefined },
          { label: t("sort.newest"), value: GenericSortType.NEWEST },
          { label: t("sort.oldest"), value: GenericSortType.OLDEST },
        ]}
        value={sort}
        onChange={handleSortChange}
      />

      {isStarred !== undefined || sort !== undefined ? (
        <Button
          icon={faRotateBack}
          className="w-full"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          {t("clear")}
        </Button>
      ) : null}
    </div>
  );
}
