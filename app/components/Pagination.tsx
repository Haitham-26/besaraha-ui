"use client";

import React from "react";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./Button";
import { PageMeta } from "@/model/shared/types/PageMeta";

const getButtonStyles = (active?: boolean) => {
  const base =
    "w-10 h-10 !p-2 flex items-center justify-center rounded-xl border transition-all shadow-none";

  if (active) {
    return `${base} !bg-accent !text-white !border-accent`;
  }

  return `${base} !bg-surface !border-border !text-text-muted hover:!border-accent hover:!text-accent`;
};

type PaginationProps = {
  meta?: PageMeta;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  meta,
  onPageChange,
}) => {
  if (!meta || meta.total <= meta.limit) {
    return null;
  }

  const totalPages = Math.ceil(meta.total / meta.limit);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === meta.page) {
      return;
    }

    onPageChange(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pb-12">
      <Button
        icon={faAngleRight}
        disabled={meta.page === 1}
        onClick={() => handlePageChange(meta.page - 1)}
        className={getButtonStyles(false)}
      />

      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            onClick={() => handlePageChange(page)}
            className={getButtonStyles(page === meta.page)}
          >
            <span className="text-xs font-black">{page}</span>
          </Button>
        ))}
      </div>

      <Button
        icon={faAngleLeft}
        disabled={!meta.hasNext}
        onClick={() => handlePageChange(meta.page + 1)}
        className={getButtonStyles(false)}
      />
    </div>
  );
};
