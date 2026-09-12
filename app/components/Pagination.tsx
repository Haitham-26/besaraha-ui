import React from "react";
import Link from "next/link";
import { Link as LocaleLink } from "@/i18n/navigation";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons/faAngleRight";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import { Icon } from "./Icon";
import { PageMeta } from "@/model/shared/types/PageMeta";

const getLinkStyles = (active?: boolean) => {
  const base =
    "w-10 h-10 p-2 flex items-center justify-center rounded-xl border transition-all shadow-none";

  if (active) {
    return `${base} bg-accent text-white border-accent`;
  }

  return `${base} bg-surface border-border text-text-muted hover:border-accent hover:text-accent`;
};

type PaginationProps = {
  meta?: PageMeta;
  pathname: string;
  searchParams: URLSearchParams;
  shouldUseLocalePrefix?: boolean;
};

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  pathname,
  searchParams,
  shouldUseLocalePrefix = false,
}) => {
  const LinkToUse = shouldUseLocalePrefix ? LocaleLink : Link;

  if (!meta || meta.total <= meta.limit) {
    return null;
  }

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", String(page));

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-12">
      {meta.page > 1 ? (
        <LinkToUse
          href={getPageUrl(meta.page - 1)}
          className={getLinkStyles()}
          aria-label="الصفحة السابقة"
        >
          <Icon icon={faAngleRight} />
        </LinkToUse>
      ) : (
        <span className={`${getLinkStyles()} opacity-40 cursor-not-allowed`}>
          <Icon icon={faAngleRight} />
        </span>
      )}

      <div className="flex items-center gap-2">
        {Array.from(
          { length: Math.ceil(meta.total / meta.limit) },
          (_, i) => i + 1,
        ).map((page) => (
          <LinkToUse
            key={page}
            href={getPageUrl(page)}
            className={getLinkStyles(page === meta.page)}
            aria-current={page === meta.page ? "page" : undefined}
          >
            <span className="text-xs font-black">{page}</span>
          </LinkToUse>
        ))}
      </div>

      {meta.hasNext ? (
        <LinkToUse
          href={getPageUrl(meta.page + 1)}
          className={getLinkStyles()}
          aria-label="الصفحة التالية"
        >
          <Icon icon={faAngleLeft} />
        </LinkToUse>
      ) : (
        <span className={`${getLinkStyles()} opacity-40 cursor-not-allowed`}>
          <Icon icon={faAngleLeft} />
        </span>
      )}
    </div>
  );
};
