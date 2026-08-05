import React, { useState } from "react";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Icon } from "./Icon";
import { Button } from "./Button";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
  valid?: boolean;
  errorMessage?: string;
  labelClassName?: string;
};

export const Input: React.FC<InputProps> = ({
  title,
  valid = true,
  errorMessage,
  className,
  labelClassName,
  required,
  ...props
}) => {
  const [type, setType] = useState<HTMLInputElement["type"]>(
    props?.type || "text",
  );

  const forceLTR = () => {
    switch (props?.type) {
      case "email":
      case "password":
      case "tel":
        return true;
      default:
        return false;
    }
  };

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
          {required && <span className="text-danger"> *</span>}
        </label>
      ) : null}

      <div className="relative">
        {props.type === "password" ? (
          <Button
            className="shadow-none !bg-transparent !p-2 !text-accent !absolute top-1/2 right-3 -translate-y-1/2"
            icon={type === "text" ? faEye : faEyeSlash}
            onClick={() =>
              setType((prev) => (prev === "password" ? "text" : "password"))
            }
          />
        ) : null}
        <input
          id={props.id || props.name}
          className={`
            w-full py-3.5 px-5 rounded-2xl outline-none transition-all duration-300
            bg-surface border-2 text-text-primary placeholder:text-text-muted/50
            
            ${valid ? "border-border shadow-sm" : "border-danger bg-danger/5"}
            ${
              valid
                ? "focus:border-accent focus:ring-4 focus:ring-accent/10 focus:shadow-md"
                : "focus:ring-4 focus:ring-danger/10"
            }
            ${props.type === "password" ? "pr-12" : ""}
            ${forceLTR() ? "[direction:ltr] placeholder:text-right" : ""}
            
            ${className || ""}
          `}
          {...props}
          type={type}
        />

        {!valid && (
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-danger">
            <Icon icon={faCircleExclamation} />
          </div>
        )}
      </div>

      {!valid && errorMessage && (
        <div className="min-h-[20px] px-1">
          <p className="text-danger text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
            {errorMessage}
          </p>
        </div>
      )}

      {props.maxLength ? (
        <span className={`block ms-auto text-xs font-black text-text-muted`}>
          {props.value?.toString().length || 0} / {props.maxLength}
        </span>
      ) : null}
    </div>
  );
};
