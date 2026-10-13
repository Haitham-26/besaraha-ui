"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@/app/components/Icon";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { useTranslations } from "next-intl";

type Props = {
  items: {
    label: string;
    value?: any;
  }[];
  value?: any;
  onChange: (value?: any) => void;
  title?: string;
  placeholder?: string;
};

export const Select: React.FC<Props> = ({
  items = [],
  value,
  onChange,
  title,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("common");

  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val?: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {title ? (
        <p className="text-xs text-text-muted font-black mb-2">{title}</p>
      ) : null}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between w-full p-3 px-4 rounded-xl border cursor-pointer transition-all
          ${isOpen ? "border-accent ring-2 ring-accent/10" : "border-border bg-surface"}
          hover:border-accent
        `}
      >
        <span
          className={`text-xs ${selectedItem ? "text-text-primary" : "text-slate-400"}`}
        >
          {selectedItem
            ? selectedItem.label
            : placeholder || `${t("select")}...`}
        </span>

        <Icon
          icon={faChevronDown}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen ? (
        <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
          {items.length ? (
            <div className="max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.label}
                  onClick={() => handleSelect(item.value)}
                  className={`
                    p-3 px-4 cursor-pointer text-xs transition-colors text-start select-none
                    ${value === item.value ? "bg-accent/10 text-accent font-bold" : "text-text-primary hover:bg-slate-50"}
                  `}
                >
                  {item.label}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-400 text-sm">
              لا توجد خيارات
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
