"use client";

import { getCroppedImage } from "@/tools/getCroppedImage";
import React, { useCallback, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { Button } from "./Button";
import { useTranslations } from "next-intl";

type ImageCropModalProps = {
  imageSrc: string;
  fileName: string;
  aspect?: number;
  onCancel: () => void;
  onSave: (file: File) => void;
};

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  fileName,
  aspect = 1,
  onCancel,
  onSave,
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const t = useTranslations("common");

  const handleCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) {
      return;
    }

    setIsSaving(true);
    try {
      const file = await getCroppedImage({
        cropArea: croppedAreaPixels,
        imageSrc,
        fileName,
      });
      onSave(file);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-4 shadow-xl">
        <h2 className="text-center text-lg font-bold text-slate-600">
          {t("imageUpload.crop.title")}
        </h2>

        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-slate-900">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <label className="flex items-center gap-3 text-sm text-slate-500">
          <span className="shrink-0 font-bold">
            {t("imageUpload.crop.zoom")}
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-accent cursor-pointer"
          />
        </label>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel} disabled={isSaving} variant="outline">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
            disabled={isSaving || !croppedAreaPixels}
          >
            {t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
};
