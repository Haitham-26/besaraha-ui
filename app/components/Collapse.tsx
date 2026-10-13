"use client";

import React, { useState } from "react";
import { Icon } from "@/app/components/Icon";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { Button } from "./Button";

type CollapseProps = {
  items: {
    title: string;
    description: string;
  }[];
};

export const Collapse: React.FC<CollapseProps> = ({ items = [] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={index}
            className="bg-surface border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-accent/30"
          >
            <Button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="!bg-transparent shadow-none w-full !p-6 [&>div]:w-full [&>div]:justify-between [&_div]:text-start gap-4 active:scale-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="font-black text-primary">{item.title}</span>
              <div
                className={`w-8 h-8 rounded-xl bg-surface-muted flex items-center justify-center text-accent shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180 !bg-accent/10" : ""
                }`}
              >
                <Icon icon={faChevronDown} className="text-sm" />
              </div>
            </Button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100 pb-6 px-6"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-text-muted leading-7 font-medium border-t border-border/50 pt-4">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
