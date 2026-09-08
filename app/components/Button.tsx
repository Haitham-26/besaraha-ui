import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React from "react";
import { Icon } from "./Icon";
import { Spinner } from "./Spinner";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
  loading?: boolean;
  icon?: IconProp;
  variant?: "primary" | "secondary" | "outline";
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  className,
  icon,
  variant = "primary",
  ...props
}) => {
  const isDisabled = loading || props.disabled;

  const variants = {
    primary: `bg-accent text-white shadow-lg shadow-accent/20 ${!isDisabled ? "hover:bg-accent/90" : ""} border-transparent`,
    secondary: `bg-primary text-white shadow-lg shadow-primary/10 ${!isDisabled ? "hover:opacity-90" : ""} border-transparent`,
    outline: `bg-transparent border-2 border-border text-text-primary ${!isDisabled ? "hover:bg-surface-muted hover:border-text-muted/30" : ""}`,
  };

  return (
    <button
      className={`
        relative overflow-hidden flex items-center justify-center gap-3
        py-3.5 px-7 rounded-2xl font-bold text-base
        transition-all duration-300 ease-out active:scale-95
        ${variants[variant]}
        ${
          isDisabled
            ? "opacity-70 cursor-not-allowed grayscale-[0.2]"
            : "cursor-pointer"
        }
        ${className || ""}
      `}
      {...props}
      disabled={isDisabled}
    >
      {loading ? <Spinner /> : null}

      <div
        className={`flex items-center justify-center gap-2 transition-all ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {children}
        {icon ? <Icon icon={icon} className="text-sm" /> : null}
      </div>
    </button>
  );
};
