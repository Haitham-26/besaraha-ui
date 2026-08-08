import React from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";

type TextareaProps = React.InputHTMLAttributes<HTMLTextAreaElement> & {
  title?: string;
  valid?: boolean;
  errorMessage?: string;
  labelClassName?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
  title,
  valid = true,
  errorMessage,
  className,
  labelClassName,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full group">
      {title ? (
        <label
          htmlFor={props.id || props.name}
          className={`text-sm font-bold tracking-tight transition-colors duration-200 px-1 ${
            valid
              ? "text-text-primary group-focus-within:text-accent"
              : "text-danger"
          } ${labelClassName || ""}`}
        >
          {title}
        </label>
      ) : null}

      <div className="relative">
        <textarea
          id={props.id || props.name}
          autoComplete="off"
          className={`
            w-full py-3.5 px-5 rounded-2xl outline-none transition-colors duration-300 max-h-32 min-h-12
            bg-surface border-2 text-text-primary placeholder:text-text-muted/50
            ${valid ? "border-border shadow-sm" : "border-danger bg-danger/5"}
            ${
              valid
                ? "focus:border-accent focus:ring-4 focus:ring-accent/10 focus:shadow-md"
                : "focus:ring-4 focus:ring-danger/10"
            }            
            ${className || ""}
          `}
          {...props}
        />

        {!valid ? (
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-danger">
            <Icon icon={faCircleExclamation} />
          </div>
        ) : null}
      </div>

      {!valid && errorMessage ? (
        <div className="min-h-[20px] px-1">
          <p className="text-danger text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMessage}
          </p>
        </div>
      ) : null}

      {props.maxLength ? (
        <span className={`block ms-auto text-xs font-black text-text-muted`}>
          {props.value?.toString().length || 0} / {props.maxLength}
        </span>
      ) : null}
    </div>
  );
};
