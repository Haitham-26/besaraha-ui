"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { ImageCropModal } from "./ImageCropModal";
import { Popover } from "./Popover";
import Image from "next/image";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

type ImageUploadProps = {
  value: File | string | null;
  onChange: (file: File | string) => void;
  label: string;
  accept?: string;
  className?: string;
  aspect?: number;
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  accept = "image/*",
  label,
  className = "",
  aspect = 1,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingSrc, setPendingSrc] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const t = useTranslations("common.imageUpload");

  const getSrc = () => {
    if (value instanceof File) {
      return previewUrl;
    }

    if (value === "null") {
      return null;
    }

    return value;
  };

  const src = getSrc();

  const handlePick = () => inputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setPendingFile(file);
    setPendingSrc(URL.createObjectURL(file));
  };

  const closeCropModal = () => {
    if (pendingSrc) {
      URL.revokeObjectURL(pendingSrc);
    }

    setPendingFile(null);
    setPendingSrc(null);
  };

  const handleCropSave = (croppedFile: File) => {
    onChange(croppedFile);
    closeCropModal();
  };

  const handleRemove = () => {
    onChange("null");
  };

  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }

    setPreviewUrl(null);
  }, [value]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <span className="text-sm font-bold text-slate-600">{label}</span>

      <div className="relative h-32 w-32 shrink-0">
        <div
          role={!src ? "button" : undefined}
          tabIndex={!src ? 0 : undefined}
          onClick={!src ? handlePick : undefined}
          onKeyDown={
            !src ? (event) => event.key === "Enter" && handlePick() : undefined
          }
          className={`h-full w-full overflow-hidden rounded-full border border-slate-600 bg-slate-50 ${
            !src ? "cursor-pointer" : ""
          }`}
        >
          {src ? (
            <Image
              src={src}
              alt={label}
              fill
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
              <Icon icon={faImage} className="text-xl" />
              <span className="text-xs font-bold">إضافة صورة</span>
            </div>
          )}
        </div>

        {src ? (
          <Popover
            align="end"
            trigger={({ open, toggle }) => (
              <Button
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                className="!p-0 !absolute -bottom-1 -end-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-lg transition-transform hover:scale-105"
              >
                <Icon icon={faPen} className="text-sm" />
              </Button>
            )}
          >
            <Button
              onClick={handlePick}
              className="!bg-transparent rounded-none shadow-none w-full text-sm !text-slate-300 hover:!bg-white/5 hover:!text-white"
            >
              {t("actions.change")}
            </Button>
            <Button
              onClick={handleRemove}
              className="!bg-transparent rounded-none shadow-none w-full text-sm !text-red-400 hover:!bg-red-500/10 hover:!text-red-300"
            >
              {t("actions.remove")}
            </Button>
          </Popover>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {pendingFile && pendingSrc ? (
        <ImageCropModal
          imageSrc={pendingSrc}
          fileName={pendingFile.name}
          aspect={aspect}
          onCancel={closeCropModal}
          onSave={handleCropSave}
        />
      ) : null}
    </div>
  );
};
