"use client";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { ImageCropModal } from "./ImageCropModal";
import { Button } from "./Button";

type ImageUploadProps = {
  value: File | string | null;
  onChange: (file: File | string) => void;
  accept?: string;
  label?: string;
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

  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
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
      {label ? (
        <span className="text-sm font-bold text-slate-600">{label}</span>
      ) : null}

      <div
        role="button"
        tabIndex={0}
        onClick={handlePick}
        onKeyDown={(event) => event.key === "Enter" && handlePick()}
        className="image-wrapper group relative h-32 w-32 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
      >
        {src ? (
          <Fragment>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={label ?? "الصورة"}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                onClick={handlePick}
                aria-label="تغيير الصورة"
                className="!p-0 flex h-8 w-8 items-center justify-center rounded-full !bg-white/90 !text-slate-700 hover:!bg-white"
              >
                <Icon icon={faPen} className="text-xs" />
              </Button>
              <Button
                type="button"
                onClick={handleRemove}
                aria-label="إزالة الصورة"
                className="!p-0 flex h-8 w-8 items-center justify-center rounded-full !bg-white/90 !text-red-500 hover:!bg-white"
              >
                <Icon icon={faTrash} className="text-xs" />
              </Button>
            </div>
          </Fragment>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
            <Icon icon={faImage} className="text-xl" />
            <span className="text-xs font-bold">إضافة صورة</span>
          </div>
        )}
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
