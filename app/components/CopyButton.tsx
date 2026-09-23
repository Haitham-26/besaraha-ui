"use client";

import React from "react";
import { Button } from "./Button";
import { Toast } from "@/tools/Toast";
import { useTranslations } from "next-intl";

type Props = {
  text: string;
  className?: string;
};

export const CopyButton: React.FC<Props> = ({ text, className = "" }) => {
  const t = useTranslations("common");

  const copy = () => {
    navigator.clipboard.writeText(text);
    Toast.success(t("copySuccess"));
  };

  return (
    <Button className={`shadow-none shrink-0 ${className}`} onClick={copy}>
      {t("copy")}
    </Button>
  );
};
