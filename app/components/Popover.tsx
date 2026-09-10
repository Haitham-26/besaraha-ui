"use client";

import React, { useEffect, useId, useRef, useState } from "react";

type PopoverAlign = "start" | "end";

type PopoverProps = {
  trigger: (state: { open: boolean; toggle: () => void }) => React.ReactNode;
  children: React.ReactNode;
  align?: PopoverAlign;
  classNames?: {
    trigger?: string;
    panel?: string;
  };
};

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = "end",
  classNames = {
    trigger: "",
    panel: "",
  },
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${classNames.trigger}`}>
      {trigger({ open, toggle })}

      {open ? (
        <div
          id={panelId}
          role="menu"
          className={`absolute top-full ${
            align === "end" ? "end-0" : "start-0"
          } z-50 mt-2 min-w-48 rounded-xl border border-white/10 bg-[#111827] py-2 shadow-xl shadow-black/40 ${classNames.panel}`}
          onClick={close}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
