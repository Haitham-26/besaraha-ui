"use client";

import { Pagination } from "@/app/components/Pagination";
import { PageMeta } from "@/model/shared/types/PageMeta";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React from "react";

type PublicQuestionsPaginationProps = {
  meta?: PageMeta;
};

export const PublicQuestionsPagination: React.FC<
  PublicQuestionsPaginationProps
> = ({ meta }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return <Pagination meta={meta} onPageChange={handlePageChange} />;
};
