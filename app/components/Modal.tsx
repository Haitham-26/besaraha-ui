"use client";

import React, { useEffect } from "react";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { Button } from "./Button";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  onClose?: VoidFunction;
  open: boolean;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  title,
  onClose,
  open,
  children,
}) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const content = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300 overflow-y-auto"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-primary/40 backdrop-blur-md pointer-events-none" />

      <div
        className="relative bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 mb-6 mt-24 md:mb-10 md:mt-40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-surface-muted/30 px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-black text-text-primary truncate">
            {title}
          </h2>

          {onClose ? (
            <Button
              onClick={onClose}
              icon={faXmark}
              className="w-10 h-10 !p-0"
              variant="outline"
            />
          ) : null}
        </div>

        <div className="p-8 text-text-primary">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};
